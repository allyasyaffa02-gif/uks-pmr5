import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ChangePasswordDto, LoginDto, ResetPasswordDto } from '../dto/auth.dto';
import { readCookie } from '../../../common/Utils/cookie.util';
import type { AuthUserView } from '../types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Refresh token dikirim sebagai cookie httpOnly, jadi cookie HARUS dipasang
   * manual lewat header Set-Cookie (bukan bagian dari body JSON).
   */
  private sendTokens(
    res: Response,
    result: { setCookie: string; accessToken: string; expiresIn: number; user: AuthUserView; message: string },
  ) {
    res.setHeader('Set-Cookie', result.setCookie);
    return {
      success: true,
      message: result.message,
      user: result.user,
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
    };
  }

  private meta(req: Request) {
    return {
      userAgent: req.headers['user-agent'] ?? null,
      // di belakang proxy, alamat asli ada di X-Forwarded-For
      ipAddress:
        (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
        req.ip ??
        null,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto, this.meta(req));
    return this.sendTokens(res, result);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = readCookie(
      req.headers.cookie,
      this.tokenService.refreshCookieName,
    );
    const result = await this.authService.refresh(refreshToken, this.meta(req));
    return this.sendTokens(res, result);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = readCookie(
      req.headers.cookie,
      this.tokenService.refreshCookieName,
    );
    const result = await this.authService.logout(refreshToken);
    res.setHeader('Set-Cookie', result.setCookie);
    return { success: true, message: result.message };
  }

  /** Endpoint terlindungi: dipakai frontend untuk memulihkan sesi & token. */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AuthUserView) {
    return this.authService.me(user);
  }

  /** Butuh Bearer token: hanya user yang login yang bisa ganti password. */
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentUser() user: AuthUserView,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.changePassword(dto, user);
    if ('setCookie' in result && result.setCookie) {
      res.setHeader('Set-Cookie', result.setCookie);
    }
    const { setCookie, ...body } = result as typeof result & { setCookie?: string };
    return body;
  }

  /**
   * Lupa password (belum login): reset hanya dengan username + password baru.
   * Semua sesi lama dicabut supaya pemilik akun yang sebenarnya bisa masuk dan
   * siapa pun yang memakai token lama langsung ter-logout.
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
