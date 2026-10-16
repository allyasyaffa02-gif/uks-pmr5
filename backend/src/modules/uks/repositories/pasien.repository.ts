import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Prisma } from "../../../generated/prisma";

/** Satu obat yang dipakai pada sebuah kasus (relasi pasien <-> obat). */
export interface CreatePasienObatData {
  obatId: number;
  jumlah: number;
}

export interface CreatePasienData {
  name: string;
  kelas: string;
  kategoriId: bigint;
  date: Date;
  time: string;
  keluhan: string;
  penanganan: string;
  obat?: CreatePasienObatData[];
}

export interface FilterPasienParams {
  search?: string;
  kategoriId?: bigint;
}

const PasienInclude = {
  kategori: true,
  pasianObats: {
    include: {
      obat: {
        include: { satuan: true },
      },
    },
  },
};

export type PasienWithRelation = Prisma.PasienGetPayload<{
  include: typeof PasienInclude;
}>;

@Injectable()
export class PasienRepository {
  private get db() {
    return this.prisma.pasien;
  }

  constructor(private readonly prisma: PrismaService) {}

  async createPasien(data: CreatePasienData) {
    const obatList = data.obat ?? [];

    return this.prisma.$transaction(async (tx) => {
      // 1) Buat data pasien terlebih dahulu.
      const pasien = await tx.pasien.create({
        data: {
          name: data.name,
          kelas: data.kelas,
          kategoriId: data.kategoriId,
          date: data.date,
          time: data.time,
          keluhan: data.keluhan,
          penanganan: data.penanganan,
        },
      });

      // 2) Catat tiap obat yang dipakai + kurangi stoknya.
      //    Stok dicek ulang di dalam transaksi supaya tetap aman walau ada
      //    penulisan bersamaan; validasi awal tetap di service agar pesan
      //    errornya lebih ramah.
      //    Satu obat hanya boleh muncul sekali per kasus (tabel pivot tidak
      //    punya unique constraint, jadi dicek di sini juga).
      const seenObatIds = new Set<number>();

      for (const item of obatList) {
        if (seenObatIds.has(item.obatId)) {
          throw new BadRequestException(
            `Obat dengan ID ${item.obatId} dipilih lebih dari sekali dalam satu kasus`,
          );
        }
        seenObatIds.add(item.obatId);

        const obat = await tx.obat.findFirst({
          where: { id: item.obatId, deletedAt: null },
        });

        if (!obat) {
          throw new BadRequestException(
            `Obat dengan ID ${item.obatId} tidak ditemukan`,
          );
        }

        const stokTersedia = Number(obat.stok);
        if (stokTersedia < item.jumlah) {
          throw new BadRequestException(
            `Stok obat "${obat.name}" tidak mencukupi. Tersedia ${stokTersedia}, diminta ${item.jumlah}`,
          );
        }

        await tx.pasian_Obat.create({
          data: {
            pasienId: pasien.id,
            obatId: BigInt(item.obatId),
            jumlah: String(item.jumlah),
          },
        });

        await tx.obat.update({
          where: { id: item.obatId },
          data: { stok: { decrement: item.jumlah } },
        });
      }

      return tx.pasien.findUnique({
        where: { id: pasien.id },
        include: PasienInclude,
      });
    });
  }

  async findAllPasien(params?: FilterPasienParams) {
    const where: any = {
      deletedAt: null,
    };

    if (params?.kategoriId) {
      where.kategoriId = params.kategoriId;
    }

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search } },
        { kelas: { contains: params.search } },
      ];
    }

    return this.db.findMany({
      where,
      include: PasienInclude,
      orderBy: [{ date: "desc" }, { id: "desc" }],
    });
  }

  async findPasienById(id: bigint) {
    return this.db.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: PasienInclude,
    });
  }

  async softDeletePasien(id: bigint) {
    return this.db.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async countTotalStats() {
    const total = await this.db.count({
      where: { deletedAt: null },
    });

    const categories = await this.prisma.masterKategori.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: {
            pasiens: {
              where: { deletedAt: null },
            },
          },
        },
      },
    });

    return {
      total,
      categories: categories.map((cat) => ({
        id: Number(cat.id),
        name: cat.name,
        count: cat._count.pasiens,
      })),
    };
  }

  async getRekapPerKelas() {
    const pasiens = await this.db.findMany({
      where: { deletedAt: null },
      include: { kategori: true },
    });

    return pasiens;
  }
}
