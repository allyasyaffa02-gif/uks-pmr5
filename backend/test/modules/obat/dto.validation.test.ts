import "reflect-metadata";
import { describe, expect, test } from "bun:test";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateObatDto } from "../../../src/modules/obat/dto/request.dto";

function validPayload() {
  return {
    name: "Paracetamol",
    stok: 10,
    satuanId: 1,
    tanggalBeli: "2026-01-01",
    tanggalKadaluarsa: "2027-01-01",
  };
}

describe("CreateObatDto", () => {
  test("valid", async () => {
    const dto = plainToInstance(CreateObatDto, validPayload());
    expect(await validate(dto)).toHaveLength(0);
  });

  test("nama wajib diisi", async () => {
    const dto = plainToInstance(CreateObatDto, { ...validPayload(), name: "" });
    const errors = await validate(dto);
    expect(errors.map((e) => e.constraints?.isNotEmpty)).toContain(
      "Nama obat tidak boleh kosong",
    );
  });

  test("stok harus angka", async () => {
    const dto = plainToInstance(CreateObatDto, {
      ...validPayload(),
      stok: "bukan-angka",
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === "stok")).toBe(true);
  });

  test("satuanId wajib diisi (angka)", async () => {
    const dto = plainToInstance(CreateObatDto, {
      ...validPayload(),
      satuanId: undefined,
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === "satuanId")).toBe(true);
  });

  test("tanggal harus format ISO", async () => {
    const dto = plainToInstance(CreateObatDto, {
      ...validPayload(),
      tanggalBeli: "01/01/2026",
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === "tanggalBeli")).toBe(true);
  });
});