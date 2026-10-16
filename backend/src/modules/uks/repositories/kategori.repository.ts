import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class MasterKategoriRepository {
  private get db() {
    return this.prisma.masterKategori;
  }

  constructor(private readonly prisma: PrismaService) {}

  async findAllCategories() {
    return this.db.findMany({
      where: { deletedAt: null },
      orderBy: { id: "asc" },
    });
  }

  async findCategoryByName(name: string) {
    return this.db.findFirst({
      where: {
        name: {
          contains: name,
        },
        deletedAt: null,
      },
    });
  }

  async createCategory(name: string) {
    return this.db.create({
      data: { name },
    });
  }
}
