import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: { username, deletedAt: null },
    });
  }

  async updatePasswordById(id: bigint, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }
}
