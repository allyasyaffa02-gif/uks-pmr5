import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CreatePasienData,
  CreatePasienObatData,
  PasienRepository,
  PasienWithRelation,
} from "../repositories/pasien.repository";
import { CreateKasusDto, CreateKasusObatDto } from "../dto/create-kasus.dto";
import { FilterKasusDto } from "../dto/filter-kasus.dto";
import { MasterKategoriRepository } from "../repositories/kategori.repository";
import { ObatRepository } from "../../obat/repositories/obat.repository";

@Injectable()
export class UksService {
  constructor(
    private readonly pasienRepository: PasienRepository,
    private readonly masterKategoriRepository: MasterKategoriRepository,
    private readonly obatRepository: ObatRepository,
  ) {}

  private serializePasien(pasien: PasienWithRelation) {
    return {
      id: Number(pasien.id),
      nama: pasien.name,
      kelas: pasien.kelas,
      situasi: pasien.kategori?.name || "Hari Biasa",
      kategoriId: Number(pasien.kategoriId),
      tanggal: pasien.date ? pasien.date.toISOString().split("T")[0] : "",
      jam: pasien.time || "",
      keluhan: pasien.keluhan,
      penanganan: pasien.penanganan,
      obat: (pasien.pasianObats ?? [])
        .filter((item) => !item.deletedAt)
        .map((item) => ({
          id: Number(item.id),
          obatId: Number(item.obatId),
          nama: item.obat?.name ?? "",
          satuan: item.obat?.satuan?.name ?? "",
          jumlah: item.jumlah,
        })),
      createdAt: pasien.createdAt,
    };
  }

  async getKategoriList() {
    let categories = await this.masterKategoriRepository.findAllCategories();
    if (categories.length === 0) {
      // Seed default categories if none exist
      await this.masterKategoriRepository.createCategory("Saat Upacara");
      await this.masterKategoriRepository.createCategory("Hari Biasa");
      categories = await this.masterKategoriRepository.findAllCategories();
    }
    return categories.map((cat) => ({
      id: Number(cat.id),
      name: cat.name,
    }));
  }

  private async getOrCreateKategoriId(situasiName: string): Promise<bigint> {
    const isUpacara = /upacara/i.test(situasiName);
    const targetName = isUpacara ? "Saat Upacara" : "Hari Biasa";

    let category =
      await this.masterKategoriRepository.findCategoryByName(targetName);
    if (!category) {
      category = await this.masterKategoriRepository.createCategory(targetName);
    }
    return category.id;
  }

  /**
   * Validasi daftar obat yang dikirim dari form:
   * - tidak boleh ada obat yang sama dipilih dua kali dalam satu pengiriman,
   * - tiap obat harus ada di master obat (dan belum dihapus),
   * - jumlah minimal 1,
   * - stok di database harus mencukupi.
   * Mengembalikan payload bersih yang siap dipakai repository.
   */
  private async validateObat(
    obat?: CreateKasusObatDto[],
  ): Promise<CreatePasienObatData[]> {
    if (!obat || obat.length === 0) return [];

    const ids: number[] = [];
    const seen = new Set<number>();

    for (const item of obat) {
      if (item.jumlah < 1) {
        throw new BadRequestException(
          `Jumlah obat harus minimal 1 (obat ID ${item.obatId})`,
        );
      }

      if (seen.has(item.obatId)) {
        throw new BadRequestException(
          `Obat yang sama tidak boleh dipilih lebih dari sekali dalam satu form (obat ID ${item.obatId})`,
        );
      }

      seen.add(item.obatId);
      ids.push(item.obatId);
    }

    const masterObat = await this.obatRepository.findManyByIds(ids);
    const byId = new Map(masterObat.map((o) => [Number(o.id), o]));

    const result: CreatePasienObatData[] = [];

    for (const item of obat) {
      const obat = byId.get(item.obatId);
      if (!obat) {
        throw new NotFoundException(
          `Obat dengan ID ${item.obatId} tidak ditemukan di master obat`,
        );
      }

      const stokTersedia = Number(obat.stok);
      if (stokTersedia < item.jumlah) {
        throw new BadRequestException(
          `Stok obat "${obat.name}" tidak mencukupi. Tersedia ${stokTersedia}, diminta ${item.jumlah}`,
        );
      }

      result.push({ obatId: item.obatId, jumlah: item.jumlah });
    }

    return result;
  }

  async createKasus(dto: CreateKasusDto) {
    const kategoriId = await this.getOrCreateKategoriId(dto.situasi);
    const date = dto.tanggal ? new Date(dto.tanggal) : new Date();
    const time =
      dto.jam ||
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

    const obat = await this.validateObat(dto.obat);

    const newPasien = await this.pasienRepository.createPasien({
      name: dto.nama,
      kelas: dto.kelas,
      kategoriId,
      date,
      time,
      keluhan: dto.keluhan,
      penanganan: dto.penanganan,
      obat,
    });

    return this.serializePasien(newPasien);
  }

  async getKasusList(filterDto?: FilterKasusDto) {
    let kategoriId: bigint | undefined;
    if (filterDto?.situasi && filterDto.situasi !== "Semua") {
      const cat = await this.masterKategoriRepository.findCategoryByName(
        filterDto.situasi,
      );
      if (cat) {
        kategoriId = cat.id;
      }
    }

    const pasiens = await this.pasienRepository.findAllPasien({
      search: filterDto?.search,
      kategoriId,
    });

    return pasiens.map((p) => this.serializePasien(p));
  }

  async deleteKasus(id: number) {
    const pasien = await this.pasienRepository.findPasienById(BigInt(id));
    if (!pasien) {
      throw new NotFoundException(`Kasus dengan ID ${id} tidak ditemukan`);
    }

    await this.pasienRepository.softDeletePasien(BigInt(id));
    return { success: true, message: "Kasus berhasil dihapus" };
  }

  async getStats() {
    const statsData = await this.pasienRepository.countTotalStats();
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
    const pasiens = await this.pasienRepository.getRekapPerKelas();

    const map: Record<
      string,
      { total: number; upacara: number; harian: number }
    > = {};

    pasiens.forEach((p) => {
      const kelas = p.kelas.trim() || "(Tanpa kelas)";
      if (!map[kelas]) {
        map[kelas] = { total: 0, upacara: 0, harian: 0 };
      }
      map[kelas].total++;
      if (/upacara/i.test(p.kategori?.name || "")) {
        map[kelas].upacara++;
      } else {
        map[kelas].harian++;
      }
    });

    const kelasList = Object.keys(map).sort(
      (a, b) => map[b].total - map[a].total,
    );

    return kelasList.map((kelas) => ({
      kelas,
      total: map[kelas].total,
      upacara: map[kelas].upacara,
      harian: map[kelas].harian,
    }));
  }
}
