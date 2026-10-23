import { describe, expect, test } from "bun:test";
import {
  parseCookieHeader,
  readCookie,
  serializeCookie,
  serializeExpiredCookie,
} from "../../src/common/Utils/cookie.util";

describe("serializeCookie", () => {
  test("menyusun cookie dasar dengan path default", () => {
    expect(serializeCookie("aaa", "hello world")).toBe("aaa=hello%20world; Path=/");
  });

  test("menambahkan atribut sesuai opsi", () => {
    const cookie = serializeCookie("token", "abc", {
      maxAge: 3600,
      path: "/api/auth",
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: "example.com",
    });
    expect(cookie).toBe(
      "token=abc; Path=/api/auth; Max-Age=3600; Domain=example.com; HttpOnly; Secure; SameSite=None",
    );
  });

  test("maxAge negatif dijepit ke 0", () => {
    expect(serializeCookie("a", "b", { maxAge: -10 })).toBe(
      "a=b; Path=/; Max-Age=0",
    );
  });
});

describe("serializeExpiredCookie", () => {
  test("menghapus cookie dengan Max-Age=0", () => {
    expect(serializeExpiredCookie("token", { path: "/api/auth" })).toBe(
      "token=; Path=/api/auth; Max-Age=0",
    );
  });
});

describe("parseCookieHeader", () => {
  test("memisah pasangan key=value", () => {
    expect(parseCookieHeader("a=1; b=2; c=3")).toEqual({
      a: "1",
      b: "2",
      c: "3",
    });
  });

  test("meng-decode nilai yang ter-url-encode", () => {
    expect(parseCookieHeader("token=hello%20world")).toEqual({
      token: "hello world",
    });
  });

  test("mengabaikan bagian tanpa tanda sama-dengan", () => {
    expect(parseCookieHeader("a=1; just-a-flag; b=2")).toEqual({
      a: "1",
      b: "2",
    });
  });

  test("mengabaikan kunci kosong", () => {
    expect(parseCookieHeader("=1; b=2")).toEqual({ b: "2" });
  });

  test("header kosong/null menghasilkan objek kosong", () => {
    expect(parseCookieHeader()).toEqual({});
    expect(parseCookieHeader(null)).toEqual({});
    expect(parseCookieHeader("")).toEqual({});
  });

  test("nilai ter-encode sebagian dipakai apa adanya", () => {
    expect(parseCookieHeader("token=%zz")).toEqual({ token: "%zz" });
  });
});

describe("readCookie", () => {
  test("mengambil nilai cookie berdasarkan nama", () => {
    expect(readCookie("a=1; b=2", "b")).toBe("2");
  });

  test("mengembalikan undefined bila cookie tidak ada", () => {
    expect(readCookie("a=1", "b")).toBeUndefined();
  });
});