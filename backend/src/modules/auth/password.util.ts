import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const SALT_BYTES = 16;
const KEYLEN = 64;

/**
 * Hash password memakai scrypt bawaan Node (tanpa dependency tambahan).
 * Format simpan: `scrypt$<saltHex>$<hashHex>`.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  if (!plainPassword) throw new Error("Password tidak boleh kosong");
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const derived = (await scrypt(plainPassword, salt, KEYLEN)) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

/** Verifikasi password plain terhadap hash hasil `hashPassword`. */
export async function verifyPassword(plainPassword: string, storedHash: string): Promise<boolean> {
  if (!plainPassword || !storedHash) return false;
  const parts = storedHash.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, saltHex, hashHex] = parts;
  try {
    const derived = (await scrypt(plainPassword, saltHex, KEYLEN)) as Buffer;
    const expected = Buffer.from(hashHex, "hex");
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
