import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UksService } from '../services/uks.service';
import { CreateKasusDto } from '../dto/create-kasus.dto';
import { FilterKasusDto } from '../dto/filter-kasus.dto';

@Controller('uks')
export class UksController {
  constructor(private readonly uksService: UksService) {}

  @Get('kategori')
  async getKategori() {
    return this.uksService.getKategoriList();
  }

  @Get('stats')
  async getStats() {
    return this.uksService.getStats();
  }

  @Get('rekap')
  async getRekap() {
    return this.uksService.getRekapKelas();
  }

  @Get('kasus')
  async getKasus(@Query() filterDto: FilterKasusDto) {
    return this.uksService.getKasusList(filterDto);
  }

  @Post('kasus')
  @HttpCode(HttpStatus.CREATED)
  async createKasus(@Body() dto: CreateKasusDto) {
    return this.uksService.createKasus(dto);
  }

  @Delete('kasus/:id')
  async deleteKasus(@Param('id', ParseIntPipe) id: number) {
    return this.uksService.deleteKasus(id);
  }
}
