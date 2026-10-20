import { Module } from "@nestjs/common";
import { JurusanController } from "./controllers/jurusan.controller";
import { JurusanService } from "./services/jurusan.service";
import { MasterFacultyRepository } from "./repositories/master-faculty.repository";
import { AuthModule } from "../auth/auth.module";

@Module({
  // AuthModule menyediakan JwtAuthGuard untuk melindungi endpoint jurusan
  imports: [AuthModule],
  controllers: [JurusanController],
  providers: [JurusanService, MasterFacultyRepository],
  exports: [JurusanService],
})
export class JurusanModule {}