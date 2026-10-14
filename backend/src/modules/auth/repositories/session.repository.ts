import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { MAX_ACTIVE_SESSIONS_PER_USER } from "../auth.constants";

interface CreateSessionInput {
  id: string;
  userId: bigint;
  refreshTokenHash: string;
  expiresAt: Date;
  userAgent?: string | null;
  ipAddress?: string | null;
}

/**
 * Akses tabel `user_sessions`. Refresh token tidak pernah ditulis apa adanya:
 * yang tersimpan hanya hash-nya (lihat TokenService.hashRefreshToken).
 */
@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSessionInput) {
    return this.prisma.userSession.create({
      data: {
        id: data.id,
        userId: data.userId,
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
        userAgent: data.userAgent?.slice(0, 255) ?? null,
        ipAddress: data.ipAddress?.slice(0, 64) ?? null,
      },
    });
  }

  async findById(sessionId: string) {
    return this.prisma.userSession.findUnique({ where: { id: sessionId } });
  }

  /** Dipakai guard: sesi harus masih ada, belum dicabut, dan belum kedaluwarsa. */
  async findActiveById(sessionId: string) {
    return this.prisma.userSession.findFirst({
      where: {
        id: sessionId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  /** Rotasi: baris sesi tetap, isinya diganti token & masa berlaku baru. */
  async rotate(
    sessionId: string,
    data: {
      refreshTokenHash: string;
      expiresAt: Date;
      userAgent?: string | null;
      ipAddress?: string | null;
    },
  ) {
    return this.prisma.userSession.update({
      where: { id: sessionId },
      data: {
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
        lastUsedAt: new Date(),
        userAgent: data.userAgent?.slice(0, 255) ?? null,
        ipAddress: data.ipAddress?.slice(0, 64) ?? null,
      },
    });
  }

  async revokeById(sessionId: string) {
    return this.prisma.userSession.updateMany({
      where: { id: sessionId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: bigint) {
    return this.prisma.userSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Cabut semua sesi user KECUALI sesi yang sedang dipakai - dipanggil setelah
   * ganti password supaya perangkat lain tidak ikut memakai token lama.
   */
  async revokeOthersForUser(userId: bigint, keepSessionId: string) {
    return this.prisma.userSession.updateMany({
      where: { userId, revokedAt: null, id: { not: keepSessionId } },
      data: { revokedAt: new Date() },
    });
  }

  /** Sesi kedaluwarsa/dicabut dibersihkan agar tabel tidak menumpuk. */
  async deleteExpired(now = new Date()) {
    return this.prisma.userSession.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: now } }, { revokedAt: { not: null } }],
      },
    });
  }

  /**
   * Batasi jumlah sesi aktif per user supaya akun tidak bisa dipakai login
   * tanpa batas. Sesi paling lama tidak dipakai di atas batas akan dicabut.
   */
  async enforceSessionLimit(userId: bigint) {
    const excess = await this.prisma.userSession.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { lastUsedAt: "desc" },
      select: { id: true },
      skip: MAX_ACTIVE_SESSIONS_PER_USER,
    });

    if (excess.length === 0) return 0;

    const { count } = await this.prisma.userSession.updateMany({
      where: { id: { in: excess.map((session) => session.id) } },
      data: { revokedAt: new Date() },
    });

    return count;
  }
}
