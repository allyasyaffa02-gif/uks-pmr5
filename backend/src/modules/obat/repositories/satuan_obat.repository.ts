import { Injectable } from "@nestjs/common";
import { Master_Satuan_Obat } from "src/generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SatuanObatRepository {
  private get db() {
    return this.prisma.master_Satuan_Obat;
  }

  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Master_Satuan_Obat[]> {
    return this.db.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async getDetail(id: number): Promise<Master_Satuan_Obat | null> {
    return this.db.findUnique({
      where: { id },
    });
  }

  async delete(id: number) {
    return this.db.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
