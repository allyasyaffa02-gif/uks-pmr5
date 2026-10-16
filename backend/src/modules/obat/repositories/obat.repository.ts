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

  private buildStatusWhere(
    status: "all" | "low_stock" | "expiring_soon" | "expired",
    now = new Date(),
  ): Prisma.ObatWhereInput {
    switch (status) {
      case "low_stock":
        return { stok: { lte: LOW_STOCK_THRESHOLD } };

      case "expiring_soon": {
        const limit = new Date(now);
        limit.setDate(limit.getDate() + EXPIRING_SOON_DAYS);
        return { tanggalKadaluarsa: { gte: now, lte: limit } };
      }

      case "expired":
        return { tanggalKadaluarsa: { lt: now } };

      default:
        return {};
    }
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
      Object.assign(where, this.buildStatusWhere(params.status));
    }

    return this.db.findMany({
      include: ObatInclude,
      where,
    });
  }

  async getStatistic(): Promise<{
    all: number;
    totalStock: number;
    lowStock: number;
    expiringSoon: number;
    expired: number;
  }> {
    const now = new Date();
    const thirtyDaysAhead = new Date();
    thirtyDaysAhead.setDate(thirtyDaysAhead.getDate() + 30);

    const obat = await this.getAll();

    let expiringSoon = 0;
    let expired = 0;

    obat.forEach((item) => {
      const exp = new Date(item.tanggalKadaluarsa);

      if (exp < now) {
        expired++;
      } else if (exp <= thirtyDaysAhead) {
        expiringSoon++;
      }
    });

    const all = obat.length;
    const totalStock = obat.reduce(
      (acc, item) => acc + (Number(item.stok) || 0),
      0,
    );
    const lowStock = obat.filter((item) => Number(item.stok) <= 10).length;

    return { all, totalStock, lowStock, expiringSoon, expired };
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

  /**
   * Simpan banyak obat sekaligus dalam satu query (dipakai fitur import Excel)
   * supaya tidak ada data yang masuk setengah jalan bila terjadi kegagalan.
   */
  async createMany(data: CreateObatData[]): Promise<number> {
    if (!data.length) return 0;

    const result = await this.db.createMany({
      data: data.map((item) => ({
        name: item.name,
        stok: item.stok,
        satuanId: item.satuanId,
        tanggalBeli: item.tanggalBeli,
        tanggalKadaluarsa: item.tanggalKadaluarsa,
      })),
    });

    return result.count;
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
