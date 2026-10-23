import { describe, expect, test } from "bun:test";
import { UnauthorizedException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { TokenService } from "../../../src/modules/auth/services/token.service";
import type { JwtTokenPayload } from "../../../src/modules/auth/types/auth.types";

type JwtVerifyMock = (token: string, options: unknown) => Promise<unknown>;

function makeService(
  jwtMock: Partial<{ verifyAsync: JwtVerifyMock }> = {},
  configOverrides: Record<string, string> = {},
) {
  const values: Record<string, string> = {
    JWT_SECRET: "test-secret",
    JWT_ISSUER: "test-issuer",
    JWT_AUDIENCE: "test-audience",
    JWT_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "2d",
    AUTH_COOKIE_PATH: "/api/auth",
    COOKIE_SAME_SITE: "Lax",
    COOKIE_SECURE: "false",
    NODE_ENV: "test",
    ...configOverrides,
  };

  const config = {
    get: (key: string) => values[key],
  } as unknown as ConfigService;

  const jwtService = {
    verifyAsync: async () => ({
      sub: "1",
      username: "admin",
      isAdmin: true,
    }),
    ...jwtMock,
  };

  return new TokenService(jwtService as any, config);
}

describe("TokenService.hashRefreshToken", () => {
  test("menghasilkan hash SHA-256 hex", () => {
    const svc = makeService();
    expect(svc.hashRefreshToken("refresh-token")).toMatch(/^[0-9a-f]{64}$/);
  });

  test("deterministik", () => {
    const svc = makeService();
    expect(svc.hashRefreshToken("x")).toBe(svc.hashRefreshToken("x"));
  });
});

describe("TokenService.compareRefreshTokenHash", () => {
  test("cocok", () => {
    const svc = makeService();
    expect(svc.compareRefreshTokenHash("x", svc.hashRefreshToken("x"))).toBe(
      true,
    );
  });

  test("tidak cocok", () => {
    const svc = makeService();
    expect(svc.compareRefreshTokenHash("x", svc.hashRefreshToken("y"))).toBe(
      false,
    );
  });

  test("hash kosong -> false", () => {
    const svc = makeService();
    expect(svc.compareRefreshTokenHash("x", "")).toBe(false);
  });
});

describe("TokenService.generateSessionId", () => {
  test("32 hex chars & unik", () => {
    const svc = makeService();
    const a = svc.generateSessionId();
    const b = svc.generateSessionId();
    expect(a).toMatch(/^[0-9a-f]{32}$/);
    expect(a).not.toBe(b);
  });
});

describe("TokenService.refreshExpiryFromNow", () => {
  test("sekarang + 2 hari", () => {
    const svc = makeService();
    const before = Date.now();
    const expiry = svc.refreshExpiryFromNow();
    const diff = expiry.getTime() - before;
    expect(diff).toBeGreaterThan(2 * 24 * 3600 * 1000 - 5000);
    expect(diff).toBeLessThan(2 * 24 * 3600 * 1000 + 5000);
  });
});

describe("TokenService.buildRefreshCookie", () => {
  test("memuat atribut httpOnly & SameSite", () => {
    const svc = makeService();
    const expiry = new Date(Date.now() + 60000);
    const cookie = svc.buildRefreshCookie("token", expiry);
    expect(cookie).toContain("Path=/api/auth");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toMatch(/Max-Age=\d+/);
  });

  test("nilai token di-encode", () => {
    const svc = makeService();
    const expiry = new Date(Date.now() + 60000);
    const cookie = svc.buildRefreshCookie("tok en", expiry);
    expect(cookie).toContain("uks_refresh_token=tok%20en");
  });

  test("Max-Age nol bila token sudah kedaluwarsa", () => {
    const svc = makeService();
    const expiry = new Date(Date.now() - 1000);
    expect(svc.buildRefreshCookie("token", expiry)).toContain("Max-Age=0");
  });
});

describe("TokenService.buildRefreshCookieClearer", () => {
  test("mengosongkan nilai dengan Max-Age=0", () => {
    const svc = makeService();
    const cookie = svc.buildRefreshCookieClearer();
    expect(cookie).toContain("uks_refresh_token=");
    expect(cookie).toContain("Max-Age=0");
    expect(cookie).toContain("HttpOnly");
  });
});

describe("TokenService.verifyAccessToken", () => {
  test("mengembalikan payload untuk token access", async () => {
    const payload: JwtTokenPayload = {
      sub: "1",
      username: "admin",
      isAdmin: true,
      typ: "access",
      jti: "j1",
    };
    const svc = makeService({ verifyAsync: async () => payload });
    await expect(svc.verifyAccessToken("token")).resolves.toEqual(payload);
  });

  test("menolak token yang bukan access", async () => {
    const svc = makeService({
      verifyAsync: async () => ({
        sub: "1",
        username: "a",
        isAdmin: false,
        typ: "refresh",
      }),
    });
    await expect(svc.verifyAccessToken("token")).rejects.toThrow(
      UnauthorizedException,
    );
  });

  test("membungkus error verifikasi menjadi Unauthorized", async () => {
    const svc = makeService({
      verifyAsync: async () => {
        throw new Error("invalid token");
      },
    });
    await expect(svc.verifyAccessToken("token")).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

describe("TokenService.verifyRefreshToken", () => {
  test("mengembalikan payload refresh dengan sid", async () => {
    const payload: JwtTokenPayload & { sid: string } = {
      sub: "1",
      username: "a",
      isAdmin: false,
      typ: "refresh",
      sid: "sess-1",
      jti: "j1",
    };
    const svc = makeService({ verifyAsync: async () => payload });
    await expect(svc.verifyRefreshToken("token")).resolves.toEqual(payload);
  });

  test("menolak refresh token tanpa sid", async () => {
    const svc = makeService({
      verifyAsync: async () => ({
        sub: "1",
        username: "a",
        isAdmin: false,
        typ: "refresh",
      }),
    });
    await expect(svc.verifyRefreshToken("token")).rejects.toThrow(
      UnauthorizedException,
    );
  });

  test("menolak token yang bukan refresh", async () => {
    const svc = makeService({
      verifyAsync: async () => ({
        sub: "1",
        username: "a",
        isAdmin: false,
        typ: "access",
      }),
    });
    await expect(svc.verifyRefreshToken("token")).rejects.toThrow(
      UnauthorizedException,
    );
  });
});