import {
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
  UseGuards,
} from "@nestjs/common";
import { JurusanService } from "../services/jurusan.service";
import { CreateJurusanDto, FilterJurusanDto } from "../dto/request.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

/** Semua endpoint jurusan butuh header Authorization: Bearer <access token>. */
@Controller("jurusan")
@UseGuards(JwtAuthGuard)
export class JurusanController {
  constructor(private readonly jurusanService: JurusanService) {}

  @Get()
  async getJurusanList(@Query() filterDto: FilterJurusanDto) {
    const jurusan = await this.jurusanService.getJurusanList(filterDto.search);

    return {
      status: 200,
      message: "Berhasil mendapatkan daftar jurusan",
      data: jurusan,
    };
  }

  @Get(":id")
  async getDetailJurusan(@Param("id") id: string) {
    const jurusan = await this.jurusanService.getDetailJurusan(+id);

    return {
      status: 200,
      message: "Berhasil mendapatkan detail jurusan",
      data: jurusan,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createJurusan(@Body() dto: CreateJurusanDto) {
    const newJurusan = await this.jurusanService.createJurusan(dto);

    return {
      status: HttpStatus.CREATED,
      message: "Berhasil menambahkan jurusan",
      data: newJurusan,
    };
  }

  @Put(":id")
  async updateJurusan(
    @Param("id") id: string,
    @Body() dto: CreateJurusanDto,
  ) {
    const updatedJurusan = await this.jurusanService.updateJurusan(+id, dto);

    return {
      status: 200,
      message: "Berhasil mengupdate jurusan",
      data: updatedJurusan,
    };
  }

  @Delete(":id")
  async deleteJurusan(@Param("id") id: string) {
    const deletedJurusan = await this.jurusanService.deleteJurusan(+id);

    return {
      status: 200,
      message: "Berhasil menghapus jurusan",
      data: deletedJurusan,
    };
  }
}