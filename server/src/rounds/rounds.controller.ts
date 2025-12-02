import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '@prisma/client';

class CreateRoundDto {
  startDate!: string;
  endDate!: string;
}

@Controller('rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  @Get()
  list() {
    return this.roundsService.listRounds();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.roundsService.getRoundWithStats(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() dto: CreateRoundDto) {
    const role = req.user.role as UserRole;
    return this.roundsService.createRound(
      role,
      new Date(dto.startDate),
      new Date(dto.endDate),
    );
  }

  @Post(':id/tap')
  @UseGuards(JwtAuthGuard)
  tap(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.sub as number;
    const role = req.user.role as UserRole;
    return this.roundsService.tap(id, userId, role);
  }
}


