import { Injectable } from "@nestjs/common";
import {
  ObatRepository,
  ObatWithRelation,
} from "../repositories/obat.repository";
import { SatuanObatRepository } from "../repositories/satuan_obat.repository";
import { CreateObatDto, FilterObatDto } from "../dto/request.dto";

@Injectable()
export class ObatService {
  constructor(
    private readonly obatRepository: ObatRepository,
    private readonly satuanObatRepository: SatuanObatRepository,
  ) {}

  private serializeObat(obat: ObatWithRelation) {
    return {
      id: Number(obat.id),
      name: obat.name,
      stok: Number(obat.stok),
      satuanId: Number(obat.satuanId),
      tanggalBeli: obat.tanggalBeli
        ? obat.tanggalBeli.toISOString().split("T")[0]
        : "",
      tanggalKadaluarsa: obat.tanggalKadaluarsa
        ? obat.tanggalKadaluarsa.toISOString().split("T")[0]
        : "",
      satuan: obat.satuan.name,
    };
  }

  async getSatuanObatList() {
    const satuans = await this.satuanObatRepository.getAll();

    return satuans.map((satuan) => ({
      id: Number(satuan.id),
      name: satuan.name,
    }));
  }

  async getObatList(filterDto?: FilterObatDto) {
    const obat = await this.obatRepository.getAll(filterDto);

    const obatWithSatuan = obat.map((obat) => this.serializeObat(obat));
    return obatWithSatuan;
  }

  async getDetailObat(id: number) {
    const obat = await this.obatRepository.getDetail(id);

    const obatWithSatuan = this.serializeObat(obat);

    return obatWithSatuan;
  }

  async createObat(dto: CreateObatDto) {
    const tanggalBeli = dto.tanggalBeli
      ? new Date(dto.tanggalBeli)
      : new Date();
    const tanggalKadaluarsa = dto.tanggalKadaluarsa
      ? new Date(dto.tanggalKadaluarsa)
      : new Date();

    const newObat = await this.obatRepository.createObat({
      name: dto.name,
      stok: dto.stok,
      satuanId: dto.satuanId,
      tanggalBeli: tanggalBeli,
      tanggalKadaluarsa: tanggalKadaluarsa,
    });

    return this.serializeObat(newObat);
  }

  async updateObat(id: number, dto: CreateObatDto) {
    const tanggalBeli = dto.tanggalBeli
      ? new Date(dto.tanggalBeli)
      : new Date();
    const tanggalKadaluarsa = dto.tanggalKadaluarsa
      ? new Date(dto.tanggalKadaluarsa)
      : new Date();

    const updatedObat = await this.obatRepository.update(id, {
      name: dto.name,
      stok: dto.stok,
      satuanId: dto.satuanId,
      tanggalBeli: tanggalBeli,
      tanggalKadaluarsa: tanggalKadaluarsa,
    });

    return this.serializeObat(updatedObat);
  }

  async deleteObat(id: number) {
    const deletedObat = await this.obatRepository.delete(id);

    return this.serializeObat(deletedObat);
  }
}
