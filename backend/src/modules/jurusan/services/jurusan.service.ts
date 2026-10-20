import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { MasterFaculty } from "../../../generated/prisma";
import { MasterFacultyRepository } from "../repositories/master-faculty.repository";
import { CreateJurusanDto } from "../dto/request.dto";

@Injectable()
export class JurusanService {
  constructor(
    private readonly masterFacultyRepository: MasterFacultyRepository,
  ) {}

  private serializeFaculty(faculty: MasterFaculty) {
    return {
      id: Number(faculty.id),
      name: faculty.name,
    };
  }

  private normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, " ");
  }

  private async assertNameAvailable(
    name: string,
    excludeId?: number,
  ): Promise<void> {
    const existing = await this.masterFacultyRepository.findByName(
      name,
      excludeId,
    );

    if (existing) {
      throw new ConflictException(`Jurusan dengan nama "${name}" sudah ada`);
    }
  }

  async getJurusanList(search?: string) {
    const faculties = await this.masterFacultyRepository.findAll(
      search?.trim() || undefined,
    );

    return faculties.map((faculty) => this.serializeFaculty(faculty));
  }

  async getDetailJurusan(id: number) {
    const faculty = await this.masterFacultyRepository.findById(id);

    if (!faculty) {
      throw new NotFoundException(`Jurusan dengan ID ${id} tidak ditemukan`);
    }

    return this.serializeFaculty(faculty);
  }

  async createJurusan(dto: CreateJurusanDto) {
    const name = this.normalizeName(dto.name);

    await this.assertNameAvailable(name);

    const faculty = await this.masterFacultyRepository.create(name);

    return this.serializeFaculty(faculty);
  }

  async updateJurusan(id: number, dto: CreateJurusanDto) {
    const existing = await this.masterFacultyRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Jurusan dengan ID ${id} tidak ditemukan`);
    }

    const name = this.normalizeName(dto.name);

    await this.assertNameAvailable(name, id);

    const faculty = await this.masterFacultyRepository.update(id, name);

    return this.serializeFaculty(faculty);
  }

  async deleteJurusan(id: number) {
    const existing = await this.masterFacultyRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Jurusan dengan ID ${id} tidak ditemukan`);
    }

    const faculty = await this.masterFacultyRepository.softDelete(id);

    return this.serializeFaculty(faculty);
  }
}