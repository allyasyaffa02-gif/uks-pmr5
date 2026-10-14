import { Module } from "@nestjs/common";
import { ObatController } from "./controllers/obat.controller";
import { ObatService } from "./services/obat.service";
import { ObatImportService } from "./services/obat-import.service";
import { ObatRepository } from "./repositories/obat.repository";
import { SatuanObatRepository } from "./repositories/satuan_obat.repository";
import { AuthModule } from "../auth/auth.module";

@Module({
  // AuthModule menyediakan JwtAuthGuard untuk melindungi endpoint obat
  imports: [AuthModule],
  controllers: [ObatController],
  providers: [
    ObatService,
    ObatImportService,
    ObatRepository,
    SatuanObatRepository,
  ],
  exports: [ObatService, ObatRepository],
})
export class ObatModule {}
