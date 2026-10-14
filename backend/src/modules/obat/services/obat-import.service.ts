import { BadRequestException, Injectable } from "@nestjs/common";
import { ObatRepository } from "../repositories/obat.repository";
import { SatuanObatRepository } from "../repositories/satuan_obat.repository";
import { CreateObatData } from "../dto/request.dto";
import { ImportObatResult, ImportObatRowResult } from "../dto/response.dto";
import {
  buildObatTemplate,
  ObatImportFileError,
  ParsedObatRow,
  parseObatWorkbook,
} from "../utils/obat-excel.util";

/** Kunci pencocokan nama satuan (abaikan huruf besar/kecil & spasi berlebih). */
function satuanKey(name: string): string {
  return String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Layanan import Excel untuk Master Obat: menyiapkan file template dan
 * memproses file kiriman pengguna beserta rekap hasil per baris.
 *
 * Aturan yang disepakati: kolom `satuan` wajib ada di template dan baris dengan
 * satuan kosong/tidak terdaftar dihitung sebagai GAGAL (tanpa nilai default).
 */
@Injectable()
export class ObatImportService {
  constructor(
    private readonly obatRepository: ObatRepository,
    private readonly satuanObatRepository: SatuanObatRepository,
  ) {}

  /** Susun file template .xlsx lengkap dengan dropdown satuan dari master data. */
  async buildTemplateFile(): Promise<Buffer> {
    const satuanList = await this.satuanObatRepository.getAll();

    return buildObatTemplate(satuanList.map((satuan) => satuan.name));
  }

  /**
   * Proses file Excel kiriman pengguna: validasi tiap baris, simpan baris yang
   * valid, lalu kembalikan rekap berapa baris yang berhasil dan gagal.
   */
  async importFromExcel(file?: Express.Multer.File): Promise<ImportObatResult> {
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException("File Excel wajib diunggah");
    }

    const satuanList = await this.satuanObatRepository.getAll();

    // Peta nama satuan -> id, dipakai untuk menerjemahkan isi kolom "satuan".
    const satuanIdByName = new Map<string, number>();
    satuanList.forEach((satuan) => {
      satuanIdByName.set(satuanKey(satuan.name), Number(satuan.id));
    });

    const parsed = await this.parseFile(file.buffer);

    if (parsed.rows.length === 0) {
      throw new BadRequestException(
        "Tidak ada baris data yang bisa diproses pada file tersebut",
      );
    }

    const results: ImportObatRowResult[] = [];
    const validRows: { row: ParsedObatRow; satuanId: number }[] = [];
    const daftarSatuan = satuanList.map((satuan) => satuan.name).join(", ");

    parsed.rows.forEach((row) => {
      // 1. Kesalahan format/kelengkapan dari parser.
      if (row.error) {
        results.push({
          row: row.rowNumber,
          name: row.name || "(tanpa nama)",
          status: "failed",
          message: row.error,
        });
        return;
      }

      // 2. Satuan harus terdaftar pada master satuan obat.
      const satuanId = satuanIdByName.get(satuanKey(row.satuan));

      if (!satuanId) {
        results.push({
          row: row.rowNumber,
          name: row.name,
          status: "failed",
          message: `Satuan "${row.satuan}" tidak terdaftar. Satuan yang tersedia: ${
            daftarSatuan || "-"
          }`,
        });
        return;
      }

      validRows.push({ row, satuanId });
    });

    if (validRows.length > 0) {
      await this.saveValidRows(validRows, results);
    }

    return this.buildResult(parsed.skippedEmptyRows, results);
  }

  /**
   * Terjemahkan error struktur file (header salah, file rusak, dsb) menjadi
   * BadRequestException supaya pesannya bisa langsung ditampilkan ke pengguna.
   */
  private async parseFile(buffer: Buffer) {
    try {
      return await parseObatWorkbook(buffer);
    } catch (error) {
      if (error instanceof ObatImportFileError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Simpan baris yang sudah lolos validasi. Bila penyimpanan gagal, seluruh
   * baris tersebut ditandai gagal agar laporan per baris tetap konsisten.
   */
  private async saveValidRows(
    validRows: { row: ParsedObatRow; satuanId: number }[],
    results: ImportObatRowResult[],
  ): Promise<void> {
    const dataToInsert: CreateObatData[] = validRows.map(
      ({ row, satuanId }) => ({
        name: row.name,
        stok: row.stok as number,
        satuanId,
        tanggalBeli: row.tanggalBeli as Date,
        tanggalKadaluarsa: row.tanggalKadaluarsa as Date,
      }),
    );

    try {
      await this.obatRepository.createMany(dataToInsert);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Kesalahan tidak diketahui";

      validRows.forEach(({ row }) => {
        results.push({
          row: row.rowNumber,
          name: row.name,
          status: "failed",
          message: `Gagal disimpan ke database: ${message}`,
        });
      });
      return;
    }

    validRows.forEach(({ row }) => {
      results.push({
        row: row.rowNumber,
        name: row.name,
        status: "success",
        message: "Berhasil disimpan",
      });
    });
  }

  /** Susun rekap hasil import (jumlah berhasil/gagal + detail per baris). */
  private buildResult(
    skipped: number,
    rows: ImportObatRowResult[],
  ): ImportObatResult {
    const orderedRows = [...rows].sort((a, b) => a.row - b.row);
    const success = orderedRows.filter((row) => row.status === "success").length;

    return {
      summary: {
        total: orderedRows.length,
        success,
        failed: orderedRows.length - success,
        skipped,
      },
      rows: orderedRows,
    };
  }
}

