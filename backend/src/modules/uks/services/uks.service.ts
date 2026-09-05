import { Injectable, NotFoundException } from '@nestjs/common';
import { UksRepository } from '../repositories/uks.repository';
import { CreateKasusDto } from '../dto/create-kasus.dto';
import { FilterKasusDto } from '../dto/filter-kasus.dto';

@Injectable()
export class UksService {
  constructor(private readonly uksRepository: UksRepository) {}

  private serializePasien(pasien: any) {
    return {
      id: Number(pasien.id),
      nama: pasien.name,
      kelas: pasien.kelas,
      situasi: pasien.kategori?.name || 'Hari Biasa',
      kategoriId: Number(pasien.kategoriId),
      tanggal: pasien.date ? pasien.date.toISOString().split('T')[0] : '',
      jam: pasien.time || '',
      keluhan: pasien.keluhan,
      penanganan: pasien.penanganan,
      createdAt: pasien.createdAt,
    };
  }

  async getKategoriList() {
    let categories = await this.uksRepository.findAllCategories();
    if (categories.length === 0) {
      // Seed default categories if none exist
      await this.uksRepository.createCategory('Saat Upacara');
      await this.uksRepository.createCategory('Hari Biasa');
      categories = await this.uksRepository.findAllCategories();
    }
    return categories.map((cat) => ({
      id: Number(cat.id),
      name: cat.name,
    }));
  }

  private async getOrCreateKategoriId(situasiName: string): Promise<bigint> {
    const isUpacara = /upacara/i.test(situasiName);
    const targetName = isUpacara ? 'Saat Upacara' : 'Hari Biasa';

    let category = await this.uksRepository.findCategoryByName(targetName);
    if (!category) {
      category = await this.uksRepository.createCategory(targetName);
    }
    return category.id;
  }

  async createKasus(dto: CreateKasusDto) {
    const kategoriId = await this.getOrCreateKategoriId(dto.situasi);
    const date = dto.tanggal ? new Date(dto.tanggal) : new Date();
    const time = dto.jam || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newPasien = await this.uksRepository.createPasien({
      name: dto.nama,
      kelas: dto.kelas,
      kategoriId,
      date,
      time,
      keluhan: dto.keluhan,
      penanganan: dto.penanganan,
    });

    return this.serializePasien(newPasien);
  }

  async getKasusList(filterDto?: FilterKasusDto) {
    let kategoriId: bigint | undefined;
    if (filterDto?.situasi && filterDto.situasi !== 'Semua') {
      const cat = await this.uksRepository.findCategoryByName(filterDto.situasi);
      if (cat) {
        kategoriId = cat.id;
      }
    }

    const pasiens = await this.uksRepository.findAllPasien({
      search: filterDto?.search,
      kategoriId,
    });

    return pasiens.map((p) => this.serializePasien(p));
  }

  async deleteKasus(id: number) {
    const pasien = await this.uksRepository.findPasienById(BigInt(id));
    if (!pasien) {
      throw new NotFoundException(`Kasus dengan ID ${id} tidak ditemukan`);
    }

    await this.uksRepository.softDeletePasien(BigInt(id));
    return { success: true, message: 'Kasus berhasil dihapus' };
  }

  async getStats() {
    const statsData = await this.uksRepository.countTotalStats();
    let totalUpacara = 0;
    let totalHarian = 0;

    statsData.categories.forEach((cat) => {
      if (/upacara/i.test(cat.name)) {
        totalUpacara += cat.count;
      } else {
        totalHarian += cat.count;
      }
    });

    return {
      total: statsData.total,
      upacara: totalUpacara,
      harian: totalHarian,
    };
  }

  async getRekapKelas() {
    const pasiens = await this.uksRepository.getRekapPerKelas();

    const map: Record<string, { total: number; upacara: number; harian: number }> = {};

    pasiens.forEach((p) => {
      const kelas = p.kelas.trim() || '(Tanpa kelas)';
      if (!map[kelas]) {
        map[kelas] = { total: 0, upacara: 0, harian: 0 };
      }
      map[kelas].total++;
      if (/upacara/i.test(p.kategori?.name || '')) {
        map[kelas].upacara++;
      } else {
        map[kelas].harian++;
      }
    });

    const kelasList = Object.keys(map).sort((a, b) => map[b].total - map[a].total);

    return kelasList.map((kelas) => ({
      kelas,
      total: map[kelas].total,
      upacara: map[kelas].upacara,
      harian: map[kelas].harian,
    }));
  }
}
