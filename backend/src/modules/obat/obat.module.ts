import { Module } from "@nestjs/common";
import { ObatController } from "./controllers/obat.controller";
import { ObatService } from "./services/obat.service";
import { ObatRepository } from "./repositories/obat.repository";
import { SatuanObatRepository } from "./repositories/satuan_obat.repository";

@Module({
  controllers: [ObatController],
  providers: [ObatService, ObatRepository, SatuanObatRepository],
  exports: [ObatService, ObatRepository],
})
export class ObatModule {}
