import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export interface CreatePasienData {
  name: string;
  kelas: string;
  kategoriId: bigint;
  date: Date;
  time: string;
  keluhan: string;
  penanganan: string;
}

export interface FilterPasienParams {
  search?: string;
  kategoriId?: bigint;
}

@Injectable()
export class UksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCategories() {
    return this.prisma.masterKategori.findMany({
      where: { deletedAt: null },
      orderBy: { id: 'asc' },
    });
  }

  async findCategoryByName(name: string) {
    return this.prisma.masterKategori.findFirst({
      where: {
        name: {
          contains: name,
        },
        deletedAt: null,
      },
    });
  }

  async createCategory(name: string) {
    return this.prisma.masterKategori.create({
      data: { name },
    });
  }

  async createPasien(data: CreatePasienData) {
    return this.prisma.pasien.create({
      data: {
        name: data.name,
        kelas: data.kelas,
        kategoriId: data.kategoriId,
        date: data.date,
        time: data.time,
        keluhan: data.keluhan,
        penanganan: data.penanganan,
      },
      include: {
        kategori: true,
      },
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

    return this.prisma.pasien.findMany({
      where,
      include: {
        kategori: true,
      },
      orderBy: [
        { date: 'desc' },
        { id: 'desc' },
      ],
    });
  }

  async findPasienById(id: bigint) {
    return this.prisma.pasien.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        kategori: true,
      },
    });
  }

  async softDeletePasien(id: bigint) {
    return this.prisma.pasien.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async countTotalStats() {
    const total = await this.prisma.pasien.count({
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
    const pasiens = await this.prisma.pasien.findMany({
      where: { deletedAt: null },
      include: { kategori: true },
    });

    return pasiens;
  }
}
