import { describe, expect, test } from "bun:test";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { hashPassword } from "../../../src/modules/auth/password.util";
import { AuthService } from "../../../src/modules/auth/services/auth.service";

function makeTokenService(overrides: Record<string, unknown> = {}) {
  return {
    generateSessionId: () => "session-1",
    issueTokens: async () => ({
      accessToken: "access-1",
      refreshToken: "refresh-1",
      refreshTokenHash: "hash-1",
      accessTokenExpiresIn: 3600,
      refreshTokenExpiresAt: new Date(Date.now() + 100000),
    }),
    buildRefreshCookie: () => "uks_refresh_token=refresh-1; Path=/api/auth",
    ...overrides,
  };
}

function makeAuthService({
  authRepo = {},
  sessionRepo = {},
  tokenService = {},
}: {
  authRepo?: Record<string, unknown>;
  sessionRepo?: Record<string, unknown>;
  tokenService?: Record<string, unknown>;
} = {}) {
  const authRepository = {
    findUserByUsername: async () => null,
    findUserById: async () => null,
    updatePasswordById: async () => ({}),
    ...authRepo,
  };
  const sessionRepository = {
    deleteExpired: async () => ({}),
    enforceSessionLimit: async () => 0,
    create: async () => ({}),
    revokeAllForUser: async () => ({}),
    revokeOthersForUser: async () => ({}),
    revokeById: async () => ({}),
    findActiveById: async () => null,
    rotate: async () => ({}),
    ...sessionRepo,
  };
  const svc = new AuthService(
    authRepository as any,
    sessionRepository as any,
    makeTokenService(tokenService) as any,
  );
  return { svc, authRepository, sessionRepository };
}

describe("AuthService.login", () => {
  test("gagal bila username tidak ditemukan", async () => {
    const { svc } = makeAuthService();
    await expect(
      svc.login({ username: "ghost", password: "x" }),
    ).rejects.toThrow(UnauthorizedException);
  });

  test("gagal bila password salah", async () => {
    const hashed = await hashPassword("benar");
    const { svc } = makeAuthService({
      authRepo: {
        findUserByUsername: async () => ({
          id: BigInt(1),
          username: "admin",
          password: hashed,
          isAdmin: true,
        }),
      },
    });
    await expect(
      svc.login({ username: "admin", password: "salah" }),
    ).rejects.toThrow(UnauthorizedException);
  });

  test("sukses login membuat sesi baru", async () => {
    const hashed = await hashPassword("benar");
    const created: any[] = [];
    const { svc } = makeAuthService({
      authRepo: {
        findUserByUsername: async () => ({
          id: BigInt(1),
          username: "admin",
          password: hashed,
          isAdmin: true,
        }),
      },
      sessionRepo: {
        create: async (data: any) => {
          created.push(data);
          return {};
        },
      },
    });

    const result = await svc.login(
      { username: " admin ", password: "benar" },
      { userAgent: "test-agent" },
    );

    expect(result.accessToken).toBe("access-1");
    expect(result.expiresIn).toBe(3600);
    expect(result.message).toBe("Login berhasil");
    expect(result.user).toEqual({ id: 1, username: "admin", isAdmin: true });
    expect(result.setCookie).toContain("uks_refresh_token");

    expect(created).toHaveLength(1);
    expect(created[0].id).toBe("session-1");
    expect(created[0].userId).toEqual(BigInt(1));
    expect(created[0].refreshTokenHash).toBe("hash-1");
  });
});

describe("AuthService.resetPassword", () => {
  test("gagal bila username tidak ditemukan", async () => {
    const { svc } = makeAuthService();
    await expect(
      svc.resetPassword({ username: "ghost", newPassword: "123456" }),
    ).rejects.toThrow(NotFoundException);
  });

  test("sukses reset password & cabut semua sesi", async () => {
    const updated: any[] = [];
    const revoked: any[] = [];
    const { svc } = makeAuthService({
      authRepo: {
        findUserByUsername: async () => ({
          id: BigInt(7),
          username: "admin",
          password: "lama",
          isAdmin: true,
        }),
        updatePasswordById: async (id: unknown, hashed: string) => {
          updated.push({ id, hashed });
          return {};
        },
      },
      sessionRepo: {
        revokeAllForUser: async (id: unknown) => {
          revoked.push(id);
          return {};
        },
      },
    });

    const result = await svc.resetPassword({
      username: "admin",
      newPassword: "baru123",
    });

    expect(result.success).toBe(true);
    expect(updated).toHaveLength(1);
    expect(updated[0].id).toEqual(BigInt(7));
    expect(updated[0].hashed).toMatch(/^scrypt\$/);
    expect(revoked).toEqual([BigInt(7)]);
  });
});

describe("AuthService.changePassword", () => {
  test("gagal bila password lama salah", async () => {
    const hashed = await hashPassword("lama");
    const { svc } = makeAuthService({
      authRepo: {
        findUserByUsername: async () => ({
          id: BigInt(1),
          username: "admin",
          password: hashed,
          isAdmin: true,
        }),
      },
    });
    await expect(
      svc.changePassword(
        { username: "admin", oldPassword: "salah", newPassword: "baru123" },
        { id: 1, username: "admin", isAdmin: true },
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  test("sukses ganti password tanpa sesi aktif mencabut semua sesi", async () => {
    const hashed = await hashPassword("lama");
    const revoked: any[] = [];
    const { svc } = makeAuthService({
      authRepo: {
        findUserByUsername: async () => ({
          id: BigInt(1),
          username: "admin",
          password: hashed,
          isAdmin: true,
        }),
      },
      sessionRepo: {
        revokeAllForUser: async (id: unknown) => {
          revoked.push(id);
          return {};
        },
      },
    });

    const result = await svc.changePassword(
      { username: "admin", oldPassword: "lama", newPassword: "baru123" },
      { id: 1, username: "admin", isAdmin: true },
    );

    expect(result.success).toBe(true);
    expect(revoked).toEqual([BigInt(1)]);
  });
});

describe("AuthService.me", () => {
  test("gagal bila akun tidak ditemukan", async () => {
    const { svc } = makeAuthService();
    await expect(
      svc.me({ id: 1, username: "admin", isAdmin: true }),
    ).rejects.toThrow(UnauthorizedException);
  });

  test("mengembalikan data user", async () => {
    const { svc } = makeAuthService({
      authRepo: {
        findUserById: async () => ({
          id: BigInt(1),
          username: "admin",
          isAdmin: false,
        }),
      },
    });
    const result = await svc.me({ id: 1, username: "admin", isAdmin: false });
    expect(result).toEqual({
      success: true,
      user: { id: 1, username: "admin", isAdmin: false },
    });
  });
});