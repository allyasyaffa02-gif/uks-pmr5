import { describe, expect, test } from "bun:test";
import {
  hashPassword,
  verifyPassword,
} from "../../../src/modules/auth/password.util";

describe("hashPassword", () => {
  test("menghasilkan format scrypt$salt$hash", async () => {
    const hashed = await hashPassword("rahasia");
    const parts = hashed.split("$");
    expect(parts[0]).toBe("scrypt");
    expect(parts).toHaveLength(3);
    expect(parts[1]).toMatch(/^[0-9a-f]{32}$/); // salt 16 byte
    expect(parts[2]).toMatch(/^[0-9a-f]{128}$/); // hash 64 byte
  });

  test("salt acak membuat hash berbeda untuk password sama", async () => {
    const a = await hashPassword("rahasia");
    const b = await hashPassword("rahasia");
    expect(a).not.toBe(b);
  });

  test("password kosong ditolak", async () => {
    await expect(hashPassword("")).rejects.toThrow("Password tidak boleh kosong");
  });
});

describe("verifyPassword", () => {
  test("mencocokkan password yang benar", async () => {
    const hashed = await hashPassword("rahasia");
    await expect(verifyPassword("rahasia", hashed)).resolves.toBe(true);
  });

  test("menolak password yang salah", async () => {
    const hashed = await hashPassword("rahasia");
    await expect(verifyPassword("salah", hashed)).resolves.toBe(false);
  });

  test("menolak hash yang rusak/tidak valid", async () => {
    await expect(verifyPassword("rahasia", "hash-rusak")).resolves.toBe(false);
    await expect(verifyPassword("rahasia", "")).resolves.toBe(false);
    await expect(verifyPassword("", "scrypt$salt$hash")).resolves.toBe(false);
  });
});