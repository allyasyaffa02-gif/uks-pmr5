import "reflect-metadata";
import { describe, expect, test } from "bun:test";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateKasusDto } from "../../../src/modules/uks/dto/create-kasus.dto";

function validPayload() {
  return {
    nama: "Budi",
    kelas: "X-A",
    situasi: "Hari Biasa",
    tanggal: "2026-01-01",
    keluhan: "Demam",
    penanganan: "Istirahat",
  };
}

describe("CreateKasusDto", () => {
  test("valid", async () => {
    const dto = plainToInstance(CreateKasusDto, validPayload());
    expect(await validate(dto)).toHaveLength(0);
  });

  test("nama wajib diisi", async () => {
    const dto = plainToInstance(CreateKasusDto, { ...validPayload(), nama: "" });
    const errors = await validate(dto);
    expect(errors.map((e) => e.constraints?.isNotEmpty)).toContain(
      "Nama siswa tidak boleh kosong",
    );
  });

  test("kelas wajib diisi", async () => {
    const dto = plainToInstance(CreateKasusDto, { ...validPayload(), kelas: "" });
    const errors = await validate(dto);
    expect(errors.map((e) => e.constraints?.isNotEmpty)).toContain(
      "Kelas tidak boleh kosong",
    );
  });

  test("situasi wajib diisi", async () => {
    const dto = plainToInstance(CreateKasusDto, {
      ...validPayload(),
      situasi: "",
    });
    const errors = await validate(dto);
    expect(errors.map((e) => e.constraints?.isNotEmpty)).toContain(
      "Kategori ID atau Situasi wajib diisi",
    );
  });

  test("obat opsional ditransformasi & valid", async () => {
    const dto = plainToInstance(CreateKasusDto, {
      ...validPayload(),
      obat: [{ obatId: "10", jumlah: "3" }],
    });
    expect(await validate(dto)).toHaveLength(0);
    expect(dto.obat?.[0].obatId).toBe(10);
    expect(dto.obat?.[0].jumlah).toBe(3);
  });

  test("obat dengan jumlah < 1 ditolak (nested)", async () => {
    const dto = plainToInstance(CreateKasusDto, {
      ...validPayload(),
      obat: [{ obatId: "10", jumlah: "0" }],
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe("obat");
  });
});