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
  // Пустой DTO - даты теперь определяются на сервере
}

@Controller('rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) { }

  @Get()
  list() {
    return this.roundsService.listRounds();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  get(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.sub as number;
    return this.roundsService.getRoundWithStats(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() dto: CreateRoundDto) {
    const role = req.user.role as UserRole;
    return this.roundsService.createRound(role);
  }

  @Post(':id/tap')
  @UseGuards(JwtAuthGuard)
  tap(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.sub as number;
    const role = req.user.role as UserRole;
    return this.roundsService.tap(id, userId, role);
  }
}


