import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { ObatService } from "../services/obat.service";
import { ObatImportService } from "../services/obat-import.service";
import { CreateObatDto, FilterObatDto } from "../dto/request.dto";
import {
  OBAT_IMPORT_MAX_FILE_SIZE,
  OBAT_TEMPLATE_FILE_NAME,
} from "../utils/obat-excel.util";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

/** Semua endpoint obat butuh header Authorization: Bearer <access token>. */
@Controller("obat")
@UseGuards(JwtAuthGuard)
export class ObatController {
  constructor(
    private readonly obatService: ObatService,
    private readonly obatImportService: ObatImportService,
  ) {}

  @Get("satuan")
  async getSatuanObatList() {
    const satuanObat = await this.obatService.getSatuanObatList();
    return {
      status: 200,
      message: "Berhasil mendapatkan daftar satuan obat",
      data: satuanObat,
    };
  }

  /**
   * Unduh template import obat (.xlsx). Kolom: Nama Obat, Tanggal Beli,
   * Tanggal Kadaluarsa, Stok, dan Satuan (dropdown dari master satuan obat).
   */
  @Get("template")
  async downloadTemplate(@Res({ passthrough: true }) res: Response) {
    const file = await this.obatImportService.buildTemplateFile();

    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${OBAT_TEMPLATE_FILE_NAME}"`,
      "Content-Length": String(file.length),
    });

    return new StreamableFile(file);
  }

  /**
   * Import data obat dari file Excel. Mengembalikan rekap jumlah baris yang
   * berhasil/gagal beserta keterangan tiap barisnya.
   */
  @Post("import")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: OBAT_IMPORT_MAX_FILE_SIZE, files: 1 },
      fileFilter: (_req, file, callback) => {
        if (!/\.xlsx$/i.test(file.originalname)) {
          callback(new BadRequestException("File harus berformat .xlsx"), false);
          return;
        }

        callback(null, true);
      },
    }),
  )
  async importObat(@UploadedFile() file: Express.Multer.File) {
    const result = await this.obatImportService.importFromExcel(file);

    return {
      status: HttpStatus.OK,
      message: `Import selesai: ${result.summary.success} baris berhasil, ${result.summary.failed} baris gagal`,
      data: result,
    };
  }

  @Get()
  async getObatList(@Query() filterDto: FilterObatDto) {
    const obat = await this.obatService.getObatList(filterDto);
    return {
      status: 200,
      message: "Berhasil mendapatkan daftar obat",
      data: obat,
    };
  }

  @Get(":id")
  async getDetailObat(@Param("id") id: string) {
    const obat = await this.obatService.getDetailObat(+id);
    return {
      status: 200,
      message: "Berhasil mendapatkan detail obat",
      data: obat,
    };
  }

  @Post()
  async createObat(@Body() dto: CreateObatDto) {
    const newObat = await this.obatService.createObat(dto);
    return {
      status: HttpStatus.CREATED,
      message: "Berhasil menambahkan obat",
      data: newObat,
    };
  }

  @Put(":id")
  async updateObat(@Param("id") id: string, @Body() dto: CreateObatDto) {
    const updatedObat = await this.obatService.updateObat(+id, dto);
    return {
      status: 200,
      message: "Berhasil mengupdate obat",
      data: updatedObat,
    };
  }

  @Delete(":id")
  async deleteObat(@Param("id") id: string) {
    const deletedObat = await this.obatService.deleteObat(+id);
    return {
      status: 200,
      message: "Berhasil menghapus obat",
      data: deletedObat,
    };
  }
}
