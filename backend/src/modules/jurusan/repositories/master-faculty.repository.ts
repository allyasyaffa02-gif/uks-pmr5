import { Injectable } from "@nestjs/common";
import { MasterFaculty } from "../../../generated/prisma";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class MasterFacultyRepository {
  private get db() {
    return this.prisma.masterFaculty;
  }

  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string): Promise<MasterFaculty[]> {
    return this.db.findMany({
      where: {
        deletedAt: null,
        ...(search ? { name: { contains: search } } : {}),
      },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: number): Promise<MasterFaculty | null> {
    return this.db.findFirst({
      where: { id, deletedAt: null },
    });
  }

  /** Cari jurusan aktif berdasarkan nama persis (sudah di-trim di service). */
  async findByName(name: string, excludeId?: number): Promise<MasterFaculty | null> {
    return this.db.findFirst({
      where: {
        name,
        deletedAt: null,
        ...(excludeId !== undefined ? { id: { not: excludeId } } : {}),
      },
    });
  }

  async create(name: string): Promise<MasterFaculty> {
    return this.db.create({
      data: { name },
    });
  }

  async update(id: number, name: string): Promise<MasterFaculty> {
    return this.db.update({
      where: { id },
      data: { name },
    });
  }

  async softDelete(id: number): Promise<MasterFaculty> {
    return this.db.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}