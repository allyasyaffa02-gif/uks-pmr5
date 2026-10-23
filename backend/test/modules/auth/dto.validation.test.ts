import "reflect-metadata";
import { describe, expect, test } from "bun:test";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {
  ChangePasswordDto,
  LoginDto,
  ResetPasswordDto,
} from "../../../src/modules/auth/dto/auth.dto";

describe("LoginDto", () => {
  test("valid ketika username & password terisi", async () => {
    const dto = plainToInstance(LoginDto, {
      username: "admin",
      password: "secret",
    });
    expect(await validate(dto)).toHaveLength(0);
  });

  test("invalid ketika username kosong", async () => {
    const dto = plainToInstance(LoginDto, { username: "", password: "secret" });
    const errors = await validate(dto);
    expect(errors.map((e) => e.constraints?.isNotEmpty)).toContain(
      "Username tidak boleh kosong",
    );
  });

  test("invalid ketika password kosong", async () => {
    const dto = plainToInstance(LoginDto, { username: "admin", password: "" });
    const errors = await validate(dto);
    expect(errors.map((e) => e.constraints?.isNotEmpty)).toContain(
      "Password tidak boleh kosong",
    );
  });
});

describe("ResetPasswordDto", () => {
  test("valid", async () => {
    const dto = plainToInstance(ResetPasswordDto, {
      username: "admin",
      newPassword: "123456",
    });
    expect(await validate(dto)).toHaveLength(0);
  });

  test("password baru minimal 6 karakter", async () => {
    const dto = plainToInstance(ResetPasswordDto, {
      username: "admin",
      newPassword: "123",
    });
    const errors = await validate(dto);
    expect(errors.map((e) => e.constraints?.minLength)).toContain(
      "Password baru minimal 6 karakter",
    );
  });

  test("username wajib diisi", async () => {
    const dto = plainToInstance(ResetPasswordDto, {
      username: "",
      newPassword: "123456",
    });
    const errors = await validate(dto);
    expect(errors.map((e) => e.constraints?.isNotEmpty)).toContain(
      "Username tidak boleh kosong",
    );
  });
});

describe("ChangePasswordDto", () => {
  test("valid tanpa username opsional", async () => {
    const dto = plainToInstance(ChangePasswordDto, {
      oldPassword: "lama",
      newPassword: "baru123",
    });
    expect(await validate(dto)).toHaveLength(0);
  });

  test("password lama wajib diisi", async () => {
    const dto = plainToInstance(ChangePasswordDto, {
      oldPassword: "",
      newPassword: "baru123",
    });
    const errors = await validate(dto);
    expect(errors.map((e) => e.constraints?.isNotEmpty)).toContain(
      "Password lama tidak boleh kosong",
    );
  });

  test("password baru minimal 6 karakter", async () => {
    const dto = plainToInstance(ChangePasswordDto, {
      oldPassword: "lama",
      newPassword: "123",
    });
    const errors = await validate(dto);
    expect(errors.map((e) => e.constraints?.minLength)).toContain(
      "Password baru minimal 6 karakter",
    );
  });
});