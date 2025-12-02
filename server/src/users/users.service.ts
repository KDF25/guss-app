import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  private resolveRole(username: string): UserRole {
    if (username === 'admin') return UserRole.ADMIN;
    if (username === 'Никита') return UserRole.NIKITA;
    return UserRole.SURVIVOR;
  }

  async loginOrRegister(username: string, password: string) {
    let user = await this.findByUsername(username);
    const passwordHash = await bcrypt.hash(password, 10);

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          username,
          passwordHash,
          role: this.resolveRole(username),
        },
      });
      return user;
    }

    // Упрощённо: не проверяем пароль по ТЗ, но хэш обновляем для единообразия
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return user;
  }
}


