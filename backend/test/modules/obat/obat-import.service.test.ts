import { describe, expect, test } from "bun:test";
import { BadRequestException } from "@nestjs/common";
import { ObatImportService } from "../../../src/modules/obat/services/obat-import.service";

function makeService({
  obatRepo = {},
  satuanRepo = {},
}: {
  obatRepo?: Record<string, unknown>;
  satuanRepo?: Record<string, unknown>;
} = {}) {
  const obatRepository = {
    createMany: async () => 0,
    ...obatRepo,
  };
  const satuanObatRepository = {
    getAll: async () => [],
    ...satuanRepo,
  };
  return new ObatImportService(
    obatRepository as any,
    satuanObatRepository as any,
  );
}

describe("ObatImportService.importFromExcel", () => {
  test("gagal bila file tidak diunggah", async () => {
    const svc = makeService();
    await expect(svc.importFromExcel(undefined)).rejects.toThrow(
      BadRequestException,
    );
  });

  test("gagal bila buffer kosong", async () => {
    const svc = makeService();
    await expect(
      svc.importFromExcel({ buffer: Buffer.alloc(0) } as any),
    ).rejects.toThrow(BadRequestException);
  });
});

describe("ObatImportService.buildTemplateFile", () => {
  test("mengembalikan Buffer dari daftar satuan", async () => {
    const svc = makeService({
      satuanRepo: {
        getAll: async () => [
          { id: BigInt(1), name: "Tablet" },
          { id: BigInt(2), name: "Sirup" },
        ],
      },
    });
    const buffer = await svc.buildTemplateFile();
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
  });
});