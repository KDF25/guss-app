import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RoundStatus, UserRole } from '@prisma/client';

@Injectable()
export class RoundsService {
  constructor(private readonly prisma: PrismaService) {}

  private getCooldownDuration(): number {
    return parseInt(process.env.COOLDOWN_DURATION || '30', 10) * 1000; // секунды в мс
  }

  private calculateStatus(now: Date, start: Date, end: Date): RoundStatus {
    const cooldownEnd = new Date(start.getTime() - this.getCooldownDuration());
    
    if (now < cooldownEnd) {
      return RoundStatus.PLANNED;
    }
    if (now < start) {
      return RoundStatus.COOLDOWN;
    }
    if (now <= end) {
      return RoundStatus.ACTIVE;
    }
    return RoundStatus.FINISHED;
  }

  private async updateRoundStatus(round: any) {
    const now = new Date();
    const newStatus = this.calculateStatus(now, round.startDate, round.endDate);
    
    if (round.status !== newStatus) {
      await this.prisma.round.update({
        where: { id: round.id },
        data: { status: newStatus },
      });
      round.status = newStatus;
    }
    return round;
  }

  private isActiveRound(now: Date, start: Date, end: Date) {
    return start <= now && now <= end;
  }

  async listRounds() {
    const rounds = await this.prisma.round.findMany({
      orderBy: { startDate: 'desc' },
    });
    
    // Обновляем статусы всех раундов
    return Promise.all(rounds.map(r => this.updateRoundStatus(r)));
  }

  async getRoundWithStats(id: number) {
    const round = await this.prisma.round.findUnique({
      where: { id },
      include: {
        scores: {
          include: { user: true },
          orderBy: { points: 'desc' },
        },
      },
    });
    if (!round) return null;

    // Обновляем статус раунда
    await this.updateRoundStatus(round);

    const totalPoints = round.scores.reduce((acc, s) => acc + s.points, 0);

    return {
      ...round,
      totalPoints,
    };
  }

  async createRound(userRole: UserRole, startDate: Date, endDate: Date) {
    if (userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can create rounds');
    }

    const now = new Date();
    const status = this.calculateStatus(now, startDate, endDate);

    return this.prisma.round.create({
      data: {
        startDate,
        endDate,
        status,
      },
    });
  }

  async tap(roundId: number, userId: number, userRole: UserRole) {
    const now = new Date();
    const round = await this.prisma.round.findUnique({ where: { id: roundId } });
    if (!round) {
      throw new ForbiddenException('Round not found');
    }

    const isActive = this.isActiveRound(now, round.startDate, round.endDate);
    if (!isActive || round.status !== RoundStatus.ACTIVE) {
      throw new ForbiddenException('Round is not active');
    }

    // Никита: статистика всегда нули
    const isNikita = userRole === UserRole.NIKITA;

    const result = await this.prisma.$transaction(async (tx) => {
      const existingScore = await tx.score.findUnique({
        where: {
          userId_roundId: {
            userId,
            roundId,
          },
        },
      });

      const newTaps = (existingScore?.taps ?? 0) + 1;
      const addedPoints = newTaps % 11 === 0 ? 10 : 1;
      const newPoints = (existingScore?.points ?? 0) + addedPoints;

      const score = await tx.score.upsert({
        where: {
          userId_roundId: {
            userId,
            roundId,
          },
        },
        update: isNikita
          ? {}
          : {
              taps: newTaps,
              points: newPoints,
            },
        create: isNikita
          ? {
              userId,
              roundId,
              taps: 0,
              points: 0,
            }
          : {
              userId,
              roundId,
              taps: 1,
              points: addedPoints,
            },
      });

      const allScores = await tx.score.findMany({
        where: { roundId },
      });

      const totalPoints = allScores.reduce((acc, s) => acc + s.points, 0);

      return {
        myScore: isNikita ? { taps: 0, points: 0 } : { taps: score.taps, points: score.points },
        totalPoints,
      };
    });

    return result;
  }
}


