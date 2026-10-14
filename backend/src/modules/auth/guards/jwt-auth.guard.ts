import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { TokenService } from "../services/token.service";
import { SessionRepository } from "../repositories/session.repository";
import type { AuthUserView } from "../types/auth.types";

/**
 * Melindungi endpoint dengan header `Authorization: Bearer <access token>`.
 * Hasil verifikasi ditempel ke `request.user` sehingga controller bisa
 * membacanya lewat decorator @CurrentUser().
 *
 * Selain tanda tangan JWT, sesi di database juga dicek: logout atau cabut sesi
 * langsung mematikan access token yang masih "hidup" (tidak menunggu 1 jam).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException(
        "Token akses tidak ditemukan. Sertakan header Authorization: Bearer <token>",
      );
    }

    const payload = await this.tokenService.verifyAccessToken(token);
    const sessionId = payload.sid;

    if (!sessionId || !(await this.sessionRepository.findActiveById(sessionId))) {
      throw new UnauthorizedException(
        "Sesi sudah berakhir. Silakan login kembali",
      );
    }

    const user: AuthUserView = {
      id: Number(payload.sub),
      username: payload.username,
      isAdmin: Boolean(payload.isAdmin),
      sessionId,
    };

    request.user = user;
    return true;
  }

  private extractBearerToken(request: any): string | undefined {
    const header = request?.headers?.authorization;
    if (typeof header !== "string") return undefined;

    const [scheme, value] = header.split(" ");
    if (!value || scheme.toLowerCase() !== "bearer") return undefined;

    return value.trim();
  }
}
