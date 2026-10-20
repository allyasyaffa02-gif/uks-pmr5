import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { UksModule } from "./modules/uks/uks.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ObatModule } from "./modules/obat/obat.module";
import { JurusanModule } from "./modules/jurusan/jurusan.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UksModule,
    ObatModule,
    JurusanModule,
  ],
})
export class AppModule {}
