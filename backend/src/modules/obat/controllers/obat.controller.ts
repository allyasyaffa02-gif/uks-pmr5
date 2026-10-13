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
} from "@nestjs/common";
import { ObatService } from "../services/obat.service";
import { CreateObatDto, FilterObatDto } from "../dto/request.dto";

@Controller("obat")
export class ObatController {
  constructor(private readonly obatService: ObatService) {}

  @Get("satuan")
  async getSatuanObatList() {
    const satuanObat = await this.obatService.getSatuanObatList();
    return {
      status: 200,
      message: "Berhasil mendapatkan daftar satuan obat",
      data: satuanObat,
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
