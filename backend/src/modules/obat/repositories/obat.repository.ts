import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateObatData, FilterObatDto } from "../dto/request.dto";
import { Prisma } from "src/generated/prisma";

const ObatInclude = {
  satuan: true,
};

export type ObatWithRelation = Prisma.ObatGetPayload<{
  include: typeof ObatInclude;
}>;

const LOW_STOCK_THRESHOLD = 10;
const EXPIRING_SOON_DAYS = 30;

@Injectable()
export class ObatRepository {
  private get db() {
    return this.prisma.obat;
  }

  constructor(private readonly prisma: PrismaService) {}

  async getAll(params?: FilterObatDto): Promise<ObatWithRelation[]> {
    const where: Prisma.ObatWhereInput = {
      deletedAt: null,
    };

    // Search: nama ATAU satuan
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search } },
        { satuan: { name: { contains: params.search } } },
      ];
    }

    // Filter status
    if (params?.status && params.status !== "all") {
      const now = new Date();
      const thirtyDaysAhead = new Date();
      thirtyDaysAhead.setDate(thirtyDaysAhead.getDate() + EXPIRING_SOON_DAYS);

      switch (params.status) {
        case "low_stock":
          where.stok = { lte: LOW_STOCK_THRESHOLD };
          break;
        case "expiring_soon":
          where.tanggalKadaluarsa = { gte: now, lte: thirtyDaysAhead };
          break;
        case "expired":
          where.tanggalKadaluarsa = { lt: now };
          break;
      }
    }

    return this.db.findMany({
      include: ObatInclude,
      where,
    });
  }

  async getDetail(id: number): Promise<ObatWithRelation | null> {
    return this.db.findUnique({
      where: { id },
      include: ObatInclude,
    });
  }

  /**
   * Ambil beberapa obat sekaligus berdasarkan ID (dipakai modul UKS untuk
   * memvalidasi kecukupan stok sebelum obat dicatat pada sebuah kasus).
   */
  async findManyByIds(ids: number[]): Promise<ObatWithRelation[]> {
    if (!ids.length) return [];

    return this.db.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      include: ObatInclude,
    });
  }

  async createObat(data: CreateObatData) {
    return this.db.create({
      data: {
        name: data.name,
        stok: data.stok,
        satuanId: data.satuanId,
        tanggalBeli: data.tanggalBeli,
        tanggalKadaluarsa: data.tanggalKadaluarsa,
      },
      include: ObatInclude,
    });
  }

  async update(id: number, data: CreateObatData) {
    return this.db.update({
      where: { id },
      data: {
        name: data.name,
        stok: data.stok,
        satuanId: data.satuanId,
        tanggalBeli: data.tanggalBeli,
        tanggalKadaluarsa: data.tanggalKadaluarsa,
      },
      include: ObatInclude,
    });
  }

  async delete(id: number) {
    return this.db.update({
      where: { id },
      include: ObatInclude,
      data: { deletedAt: new Date() },
    });
  }
}
