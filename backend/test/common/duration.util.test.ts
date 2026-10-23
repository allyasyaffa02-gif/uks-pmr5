import { describe, expect, test } from "bun:test";
import { parseDurationToSeconds } from "../../src/common/Utils/duration.util";

describe("parseDurationToSeconds", () => {
  test("angka langsung dikembalikan apa adanya", () => {
    expect(parseDurationToSeconds(120, 60)).toBe(120);
  });

  test("angka nol/negatif/non-finite jatuh ke fallback", () => {
    expect(parseDurationToSeconds(0, 60)).toBe(60);
    expect(parseDurationToSeconds(-5, 60)).toBe(60);
    expect(parseDurationToSeconds(NaN, 60)).toBe(60);
  });

  test("satuan jam menjadi detik", () => {
    expect(parseDurationToSeconds("1h", 0)).toBe(3600);
  });

  test("satuan hari menjadi detik", () => {
    expect(parseDurationToSeconds("3d", 0)).toBe(3 * 24 * 60 * 60);
  });

  test("satuan menit & detik", () => {
    expect(parseDurationToSeconds("5m", 0)).toBe(300);
    expect(parseDurationToSeconds("900s", 0)).toBe(900);
  });

  test("tanpa satuan dianggap detik", () => {
    expect(parseDurationToSeconds("10", 0)).toBe(10);
  });

  test("spasi di sekitar nilai diabaikan", () => {
    expect(parseDurationToSeconds("  15m  ", 0)).toBe(900);
  });

  test("string tidak valid jatuh ke fallback", () => {
    expect(parseDurationToSeconds("abc", 77)).toBe(77);
    expect(parseDurationToSeconds("", 77)).toBe(77);
  });

  test("undefined jatuh ke fallback", () => {
    expect(parseDurationToSeconds(undefined, 88)).toBe(88);
  });

  test("nilai hasil nol jatuh ke fallback", () => {
    expect(parseDurationToSeconds("0h", 42)).toBe(42);
  });
});