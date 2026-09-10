/**
 * One DATABASE_URL, two very different drivers.
 *
 * 1. Prisma CLI (prisma.config.ts -> schema engine, Rust MySQL driver)
 *    - only accepts the `mysql://` scheme (`mariadb://` is rejected);
 *    - switches TLS on ONLY for `?sslaccept=strict` (verify the server
 *      certificate) or `?sslaccept=accept_invalid_certificates` (encrypt
 *      only). `?ssl=true` / `?sslmode=require` are silently ignored by it,
 *      which is why TiDB Cloud answers
 *      "Connections using insecure transport are prohibited".
 *
 * 2. NestJS runtime (prisma.service.ts -> @prisma/adapter-mariadb -> mariadb
 *    connector)
 *    - its connection-string parser only accepts `mariadb://`, so a TiDB style
 *      `mysql://...` URL throws "error parsing connection string";
 *    - TLS has to be handed over as an options object:
 *      `createPool({ ssl: { rejectUnauthorized } })`, never as `?sslaccept=`.
 *
 * parseDatabaseUrl() reads the URL once; toPrismaCliUrl() and
 * toMariadbPoolOptions() then emit exactly what each side understands, so the
 * same env var keeps working for a local MySQL/MariaDB and for TiDB Cloud.
 *
 * Accepted shapes (TLS is implied for the `tidb://` scheme and for hosts
 * containing "tidb", e.g. *.tidbcloud.com):
 *   mariadb://root:pw@127.0.0.1:3307/uks_pmr                        local, no TLS
 *   mysql://uks_user:pw@192.168.1.50:3306/uks_pmr                   external, no TLS
 *   mysql://<key>.root:pw@gateway01.<region>.prod.aws.tidbcloud.com:4000/db_uks
 *                                                                   TiDB, TLS on
 *   ...?sslaccept=strict | accept_invalid_certificates | ssl=false   explicit TLS
 *   ...?pool_size=20&connect_timeout=30000                           runtime tuning
 */
import { existsSync, readFileSync } from "node:fs";

export type DbScheme = "mysql" | "mariadb" | "tidb";

export interface DbTlsSettings {
  enabled: boolean;
  /** false => encrypt the traffic but do not verify the certificate chain */
  rejectUnauthorized: boolean;
  /** path or PEM taken from ?sslca= / ?ssl-ca= */
  ca?: string;
}

export interface DbConnection {
  scheme: DbScheme;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  /** every query param, keys lower-cased (shared by the CLI and the runtime) */
  params: Record<string, string>;
  tls: DbTlsSettings;
  /** true when TLS was switched on automatically for a managed TiDB endpoint */
  tlsAutoEnabled: boolean;
}

/** Structural copy of the `mariadb` connector pool options we actually set. */
export interface MariadbPoolOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: { rejectUnauthorized: boolean; ca?: string };
  connectionLimit?: number;
  acquireTimeout?: number;
  idleTimeout?: number;
  minimumIdle?: number;
  connectTimeout?: number;
  queryTimeout?: number;
  socketTimeout?: number;
  timezone?: string;
  allowPublicKeyRetrieval?: boolean;
}

const SUPPORTED_SCHEMES = ["mysql", "mariadb", "tidb"];

/** consumed here, therefore never re-emitted into the CLI url */
const TLS_KEYS = [
  "ssl",
  "sslmode",
  "ssl-mode",
  "sslaccept",
  "tls",
  "rejectunauthorized",
  "sslca",
  "ssl-ca",
  "ssl_root_cert",
  "tls-ca-file",
];
/** only understood by the runtime (mariadb) pool */
const POOL_KEYS = [
  "pool_size",
  "connectionlimit",
  "connection_limit",
  "acquiretimeout",
  "acquire_timeout",
  "idletimeout",
  "idle_timeout",
  "minimumidle",
  "minimum_idle",
  "connecttimeout",
  "connect_timeout",
  "querytimeout",
  "query_timeout",
  "sockettimeout",
  "socket_timeout",
  "allowpublickeyretrieval",
  "allow_public_key_retrieval",
  "timezone",
];

const TLS_OFF = ["false", "0", "off", "no", "none", "disable", "disabled"];
/** encrypt only - the spelling TiDB Cloud uses is `accept_invalid_certificates` */
const TLS_ENCRYPT_ONLY = [
  "required",
  "require",
  "prefer",
  "accept_invalid_certificates",
  "skip_verify",
  "skip-verify",
  "no_verify",
  "insecure",
  "allow_invalid",
];

function unquote(value: string): string {
  const trimmed = (value || "").trim();
  const first = trimmed[0];
  if (trimmed.length > 1 && (first === '"' || first === "'") && trimmed[trimmed.length - 1] === first) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

/** Safe for logs: hides the password part of a connection string. */
export function maskSecrets(url: string): string {
  return (url || "").replace(/(:\/\/[^:/@]*):[^@]*@/, "$1:***@");
}

function decodePart(value: string): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function unwrapIpv6(host: string): string {
  return host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
}

function wrapIpv6(host: string): string {
  return host.includes(":") && !host.startsWith("[") ? `[${host}]` : host;
}

/**
 * The query string is split by hand on purpose: URLSearchParams turns "+" into
 * a space and mangles the JSON form the TiDB/PlanetScale docs use,
 * `?ssl={"rejectUnauthorized":true}`.
 */
function parseParams(search: string): Record<string, string> {
  const out: Record<string, string> = {};
  const query = search.startsWith("?") || search.startsWith("&") ? search.slice(1) : search;
  for (const pair of query.split("&")) {
    if (!pair) continue;
    const at = pair.indexOf("=");
    const key = decodePart(at === -1 ? pair : pair.slice(0, at)).toLowerCase();
    out[key] = at === -1 ? "" : decodePart(pair.slice(at + 1));
  }
  return out;
}

function pick(params: Record<string, string>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = params[key];
    if (value !== undefined) return value.trim();
  }
  return undefined;
}

function numberParam(params: Record<string, string>, keys: string[], fallback: number): number {
  const raw = pick(params, keys);
  if (raw === undefined || raw === "") return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isTiDbHost(host: string): boolean {
  return /tidb/i.test(host);
}

function resolveTls(scheme: DbScheme, params: Record<string, string>, host: string) {
  const explicit = pick(params, ["sslaccept", "sslmode", "ssl-mode", "tls", "ssl"]);
  const ca = pick(params, ["sslca", "ssl-ca", "ssl_root_cert", "tls-ca-file"]);
  let enabled: boolean | undefined;
  let rejectUnauthorized = true;

  if (explicit !== undefined && explicit.startsWith("{")) {
    enabled = true;
    try {
      rejectUnauthorized = JSON.parse(explicit).rejectUnauthorized !== false;
    } catch {
      /* malformed json -> encrypt and verify, the safe default */
    }
  } else if (explicit !== undefined) {
    const flag = (explicit || "true").toLowerCase();
    if (TLS_OFF.includes(flag)) enabled = false;
    else if (TLS_ENCRYPT_ONLY.includes(flag)) {
      enabled = true;
      rejectUnauthorized = false;
    } else {
      // `strict`, `verify-ca`, `ssl=true`, ... - and any token we do not know -
      // mean encrypt AND verify, never silently fall back to plaintext.
      enabled = true;
    }
  }

  const reject = pick(params, ["rejectunauthorized"]);
  if (reject !== undefined && TLS_OFF.includes(reject.toLowerCase())) {
    enabled = true;
    rejectUnauthorized = false;
  }
  if (ca && enabled === undefined) enabled = true;

  // TiDB Cloud Serverless refuses plaintext connections, so TLS is the default there.
  const autoEnabled = enabled === undefined && (scheme === "tidb" || isTiDbHost(host));
  return { tls: { enabled: enabled === undefined ? autoEnabled : enabled, rejectUnauthorized, ca }, autoEnabled };
}

/** Reads a connection string in any of the supported spellings. */
export function parseDatabaseUrl(rawUrl: string): DbConnection {
  const value = unquote(rawUrl);
  if (!value) {
    throw new Error("DATABASE_URL is empty. See prisma/db-url.ts for the accepted formats.");
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `DATABASE_URL "${maskSecrets(value)}" is not a valid connection string. ` +
        "Expected <scheme>://<user>:<password>@<host>:<port>/<database> with scheme mysql, mariadb or tidb.",
    );
  }

  const scheme = url.protocol.replace(/:$/, "").toLowerCase();
  if (!SUPPORTED_SCHEMES.includes(scheme)) {
    throw new Error(
      `DATABASE_URL uses the unsupported scheme "${scheme}://". ` +
        "Use mysql://, mariadb:// or tidb:// - Prisma's \"mysql\" provider covers MySQL, MariaDB and TiDB.",
    );
  }

  const params = parseParams(url.search);
  const host = unwrapIpv6(url.hostname);
  const { tls, autoEnabled } = resolveTls(scheme as DbScheme, params, host);

  return {
    scheme: scheme as DbScheme,
    host,
    port: url.port ? Number(url.port) : scheme === "tidb" ? 4000 : 3306,
    user: decodePart(url.username),
    password: decodePart(url.password),
    database: decodePart(url.pathname.replace(/^\/+/, "")),
    params,
    tls,
    tlsAutoEnabled: autoEnabled,
  };
}

/**
 * Url for the Prisma CLI / schema engine: always `mysql://`, and TLS expressed
 * the only way that driver reads it (`sslaccept`). Pool-only params are
 * dropped, they mean nothing to the Rust driver.
 */
export function toPrismaCliUrl(db: DbConnection): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(db.params)) {
    if (TLS_KEYS.includes(key) || POOL_KEYS.includes(key)) continue;
    query.set(key, value);
  }
  if (db.tls.enabled) {
    query.set("sslaccept", db.tls.rejectUnauthorized ? "strict" : "accept_invalid_certificates");
    if (db.tls.ca) query.set("sslca", db.tls.ca);
  }

  const search = query.toString();
  const credentials = db.user ? `${encodeURIComponent(db.user)}:${encodeURIComponent(db.password)}@` : "";
  return `mysql://${credentials}${wrapIpv6(db.host)}:${db.port}/${db.database}${search ? `?${search}` : ""}`;
}

/**
 * Options for `mariadb.createPool()`. Passing an object instead of a string is
 * the whole point: the connector's URL parser rejects `mysql://` (the format
 * TiDB Cloud hands out) and it cannot express TLS verification in a URL.
 */
export function toMariadbPoolOptions(db: DbConnection): MariadbPoolOptions {
  const params = db.params;
  const options: MariadbPoolOptions = {
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.database,
    // TiDB sits across the internet, the connector's 1s default is too tight.
    connectTimeout: numberParam(params, ["connect_timeout", "connecttimeout"], 30_000),
    acquireTimeout: numberParam(params, ["acquire_timeout", "acquiretimeout"], 30_000),
    connectionLimit: numberParam(params, ["pool_size", "connection_limit", "connectionlimit"], 10),
    idleTimeout: numberParam(params, ["idle_timeout", "idletimeout"], 1_800),
    queryTimeout: numberParam(params, ["query_timeout", "querytimeout"], 0),
  };

  const minimumIdle = numberParam(params, ["minimum_idle", "minimumidle"], 0);
  if (minimumIdle > 0) options.minimumIdle = minimumIdle;
  const socketTimeout = numberParam(params, ["socket_timeout", "sockettimeout"], 0);
  if (socketTimeout > 0) options.socketTimeout = socketTimeout;
  const timezone = params["timezone"];
  if (timezone) options.timezone = timezone;
  const publicKey = params["allow_public_key_retrieval"] ?? params["allowpublickeyretrieval"];
  if (publicKey !== undefined && !TLS_OFF.includes(publicKey.toLowerCase())) {
    options.allowPublicKeyRetrieval = true;
  }

  if (db.tls.enabled) {
    const ssl: NonNullable<MariadbPoolOptions["ssl"]> = { rejectUnauthorized: db.tls.rejectUnauthorized };
    const ca = readCa(db.tls.ca);
    if (ca) ssl.ca = ca;
    options.ssl = ssl;
  }
  return options;
}

/** ?sslca= may carry a PEM string or a file path; the connector wants contents. */
function readCa(ca: string | undefined): string | undefined {
  if (!ca) return undefined;
  if (ca.includes("BEGIN")) return ca;
  try {
    if (existsSync(ca)) return readFileSync(ca, "utf8");
  } catch {
    /* unreadable file: fall through and hand the raw value over */
  }
  return ca;
}

/** Human readable, password-free description - safe to log. */
export function describeConnection(db: DbConnection): string {
  const engine = isTiDbHost(db.host) ? "TiDB" : db.scheme === "mariadb" ? "MariaDB" : "MySQL";
  const tls = db.tls.enabled
    ? `TLS ${db.tls.rejectUnauthorized ? "on, certificate verified" : "on, certificate NOT verified"}${
        db.tlsAutoEnabled ? " (auto: managed TiDB endpoint)" : ""
      }`
    : "TLS off";
  return `${engine} ${db.database || "(no database)"}@${db.host}:${db.port} as ${db.user || "(no user)"}, ${tls}`;
}

/** Same parse for the Nest runtime: fails loudly instead of crash-looping. */
export function requireDatabaseConnection(env: Record<string, string | undefined> = process.env): DbConnection {
  const raw = env.DATABASE_URL;
  if (!raw || !raw.trim()) {
    throw new Error(
      "DATABASE_URL is not set. Point it at your local database, e.g.\n" +
        "  mariadb://root:password@127.0.0.1:3306/db_uks\n" +
        "or at TiDB Cloud (TLS is enabled automatically for tidbcloud.com hosts), e.g.\n" +
        "  mysql://<key>.root:<password>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/db_uks",
    );
  }
  return parseDatabaseUrl(raw);
}




