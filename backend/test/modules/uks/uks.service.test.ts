import { describe, expect, test } from "bun:test";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UksService } from "../../../src/modules/uks/services/uks.service";

function makeService({
  pasienRepo = {},
  kategoriRepo = {},
  obatRepo = {},
}: {
  pasienRepo?: Record<string, unknown>;
  kategoriRepo?: Record<string, unknown>;
  obatRepo?: Record<string, unknown>;
} = {}) {
  const pasienRepository = {
    findAllPasien: async () => [],
    findPasienById: async () => null,
    softDeletePasien: async () => ({}),
    countTotalStats: async () => ({ total: 0, categories: [] }),
    getRekapPerKelas: async () => [],
    createPasien: async () => ({}),
    ...pasienRepo,
  };
  const masterKategoriRepository = {
    findAllCategories: async () => [],
    findCategoryByName: async () => null,
    createCategory: async (name: string) => ({ id: BigInt(1), name }),
    ...kategoriRepo,
  };
  const obatRepository = {
    findManyByIds: async () => [],
    ...obatRepo,
  };
  return new UksService(
    pasienRepository as any,
    masterKategoriRepository as any,
    obatRepository as any,
  );
}

describe("UksService.getStats", () => {
  test("memisahkan kasus upacara & harian", async () => {
    const svc = makeService({
      pasienRepo: {
        countTotalStats: async () => ({
          total: 10,
          categories: [
            { id: 1, name: "Saat Upacara", count: 4 },
            { id: 2, name: "Hari Biasa", count: 6 },
          ],
        }),
      },
    });
    await expect(svc.getStats()).resolves.toEqual({
      total: 10,
      upacara: 4,
      harian: 6,
    });
  });

  test("kategori non-upacara dihitung sebagai harian", async () => {
    const svc = makeService({
      pasienRepo: {
        countTotalStats: async () => ({
          total: 5,
          categories: [{ id: 1, name: "Lainnya", count: 5 }],
        }),
      },
    });
    await expect(svc.getStats()).resolves.toEqual({
      total: 5,
      upacara: 0,
      harian: 5,
    });
  });
});

describe("UksService.getRekapKelas", () => {
  test("mengelompokkan per kelas & menghitung upacara/harian", async () => {
    const svc = makeService({
      pasienRepo: {
        getRekapPerKelas: async () => [
          { kelas: "x-a", kategori: { name: "Saat Upacara" } },
          { kelas: "x-a", kategori: { name: "Hari Biasa" } },
          { kelas: "x-b", kategori: { name: "Hari Biasa" } },
        ],
      },
    });
    await expect(svc.getRekapKelas()).resolves.toEqual([
      { kelas: "X-A", total: 2, upacara: 1, harian: 1 },
      { kelas: "X-B", total: 1, upacara: 0, harian: 1 },
    ]);
  });

  test("kelas kosong menjadi (Tanpa kelas)", async () => {
    const svc = makeService({
      pasienRepo: {
        getRekapPerKelas: async () => [
          { kelas: "  ", kategori: { name: "Hari Biasa" } },
        ],
      },
    });
    await expect(svc.getRekapKelas()).resolves.toEqual([
      { kelas: "(Tanpa kelas)", total: 1, upacara: 0, harian: 1 },
    ]);
  });

  test("diurutkan berdasarkan total terbanyak", async () => {
    const svc = makeService({
      pasienRepo: {
        getRekapPerKelas: async () => [
          { kelas: "x-a", kategori: { name: "Hari Biasa" } },
          { kelas: "x-b", kategori: { name: "Hari Biasa" } },
          { kelas: "x-b", kategori: { name: "Hari Biasa" } },
        ],
      },
    });
    const result = await svc.getRekapKelas();
    expect(result.map((r) => r.kelas)).toEqual(["X-B", "X-A"]);
  });
});

describe("UksService.getKategoriList", () => {
  test("seeds kategori default bila kosong", async () => {
    const created: string[] = [];
    const svc = makeService({
      kategoriRepo: {
        findAllCategories: async () =>
          created.length === 0
            ? []
            : created.map((name, i) => ({ id: BigInt(i + 1), name })),
        createCategory: async (name: string) => {
          created.push(name);
          return { id: BigInt(created.length), name };
        },
      },
    });

    const result = await svc.getKategoriList();

    expect(created).toEqual(["Saat Upacara", "Hari Biasa"]);
    expect(result).toEqual([
      { id: 1, name: "Saat Upacara" },
      { id: 2, name: "Hari Biasa" },
    ]);
  });

  test("tidak seed bila kategori sudah ada", async () => {
    let createCalled = false;
    const svc = makeService({
      kategoriRepo: {
        findAllCategories: async () => [{ id: BigInt(5), name: "Saat Upacara" }],
        createCategory: async () => {
          createCalled = true;
          return { id: BigInt(9), name: "x" };
        },
      },
    });

    const result = await svc.getKategoriList();

    expect(createCalled).toBe(false);
    expect(result).toEqual([{ id: 5, name: "Saat Upacara" }]);
  });
});

describe("UksService.deleteKasus", () => {
  test("gagal bila kasus tidak ditemukan", async () => {
    const svc = makeService({ pasienRepo: { findPasienById: async () => null } });
    await expect(svc.deleteKasus(5)).rejects.toThrow(NotFoundException);
  });

  test("sukses soft-delete", async () => {
    let deletedId: unknown;
    const svc = makeService({
      pasienRepo: {
        findPasienById: async () => ({ id: BigInt(5) }),
        softDeletePasien: async (id: unknown) => {
          deletedId = id;
          return {};
        },
      },
    });

    const result = await svc.deleteKasus(5);

    expect(result).toEqual({ success: true, message: "Kasus berhasil dihapus" });
    expect(deletedId).toEqual(BigInt(5));
  });
});

describe("UksService.createKasus", () => {
  test("sukses tanpa obat", async () => {
    const created: any[] = [];
    const svc = makeService({
      kategoriRepo: {
        findCategoryByName: async () => null,
        createCategory: async (name: string) => ({ id: BigInt(2), name }),
      },
      pasienRepo: {
        createPasien: async (data: any) => {
          created.push(data);
          return {
            id: BigInt(1),
            name: data.name,
            kelas: data.kelas,
            kategoriId: data.kategoriId,
            date: data.date,
            time: data.time,
            keluhan: data.keluhan,
            penanganan: data.penanganan,
            kategori: { name: "Hari Biasa" },
            pasianObats: [],
            createdAt: new Date(),
          };
        },
      },
    });

    const result = await svc.createKasus({
      nama: "Budi",
      kelas: "X-A",
      situasi: "Hari Biasa",
      tanggal: "2026-01-01",
      keluhan: "Demam",
      penanganan: "Istirahat",
    });

    expect(created).toHaveLength(1);
    expect(created[0].name).toBe("Budi");
    expect(created[0].kategoriId).toEqual(BigInt(2));
    expect(created[0].obat).toEqual([]);
    expect(result.id).toBe(1);
    expect(result.kategoriId).toBe(2);
    expect(result.situasi).toBe("Hari Biasa");
    expect(result.tanggal).toBe("2026-01-01");
  });

  test("gagal bila jumlah obat < 1", async () => {
    const svc = makeService();
    await expect(
      svc.createKasus({
        nama: "Budi",
        kelas: "X-A",
        situasi: "Hari Biasa",
        tanggal: "2026-01-01",
        keluhan: "Demam",
        penanganan: "Istirahat",
        obat: [{ obatId: 1, jumlah: 0 }],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  test("gagal bila obat duplikat", async () => {
    const svc = makeService();
    await expect(
      svc.createKasus({
        nama: "Budi",
        kelas: "X-A",
        situasi: "Hari Biasa",
        tanggal: "2026-01-01",
        keluhan: "Demam",
        penanganan: "Istirahat",
        obat: [
          { obatId: 1, jumlah: 2 },
          { obatId: 1, jumlah: 3 },
        ],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  test("gagal bila obat tidak ditemukan di master", async () => {
    const svc = makeService({ obatRepo: { findManyByIds: async () => [] } });
    await expect(
      svc.createKasus({
        nama: "Budi",
        kelas: "X-A",
        situasi: "Hari Biasa",
        tanggal: "2026-01-01",
        keluhan: "Demam",
        penanganan: "Istirahat",
        obat: [{ obatId: 99, jumlah: 1 }],
      }),
    ).rejects.toThrow(NotFoundException);
  });

  test("gagal bila stok tidak mencukupi", async () => {
    const svc = makeService({
      obatRepo: {
        findManyByIds: async () => [
          { id: BigInt(1), name: "Paracetamol", stok: BigInt(2) },
        ],
      },
    });
    await expect(
      svc.createKasus({
        nama: "Budi",
        kelas: "X-A",
        situasi: "Hari Biasa",
        tanggal: "2026-01-01",
        keluhan: "Demam",
        penanganan: "Istirahat",
        obat: [{ obatId: 1, jumlah: 5 }],
      }),
    ).rejects.toThrow(BadRequestException);
  });
});