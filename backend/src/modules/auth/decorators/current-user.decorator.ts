import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { AuthUserView } from "../types/auth.types";

/**
 * Ambil user hasil verifikasi JwtAuthGuard dari request.
 * Contoh: `@CurrentUser() user: AuthUserView`
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUserView => {
    return context.switchToHttp().getRequest().user;
  },
);
