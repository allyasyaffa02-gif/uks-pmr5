import { Module } from "@nestjs/common";
import { UksController } from "./controllers/uks.controller";
import { UksService } from "./services/uks.service";
import { PasienRepository } from "./repositories/pasien.repository";
import { MasterKategoriRepository } from "./repositories/kategori.repository";
import { ObatModule } from "../obat/obat.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  // AuthModule menyediakan JwtAuthGuard untuk melindungi endpoint uks
  imports: [ObatModule, AuthModule],
  controllers: [UksController],
  providers: [UksService, MasterKategoriRepository, PasienRepository],
  exports: [UksService],
})
export class UksModule {}
