import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { AuthRepository } from './repositories/auth.repository';
import { SessionRepository } from './repositories/session.repository';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Secret JWT sengaja TIDAK didaftarkan di sini: TokenService membacanya sendiri
 * lewat ConfigService (lebih mudah dites dan secret tidak ikut tercetak di
 * pesan error JwtModule). Karena itu JwtModule hanya menyediakan provider
 * JwtService tanpa konfigurasi default.
 */
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, TokenService, AuthRepository, SessionRepository, JwtAuthGuard],
  // guard & TokenService diekspor supaya modul lain (obat, uks) bisa memakainya
  exports: [AuthService, TokenService, SessionRepository, JwtAuthGuard],
})
export class AuthModule {}
