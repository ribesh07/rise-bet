import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoundStatus } from '@prisma/client';
import { WingoService } from './wingo.service';

@Injectable()
export class WingoCron {
  constructor(
    private prisma: PrismaService,
    private wingoService: WingoService,
  ) {}

 @Cron(CronExpression.EVERY_SECOND)
async handleRounds() {
  const now = new Date();

  const expiredGroups = await this.prisma.wingoBet.groupBy({
    by: ['duration', 'endTime'],
    where: {
      status: RoundStatus.OPEN,
      endTime: { lte: now },
    },
  });

  for (const group of expiredGroups) {
    const result = Math.floor(Math.random() * 10);

    const bets = await this.prisma.wingoBet.findMany({
      where: {
        duration: group.duration,
        endTime: group.endTime,
        status: RoundStatus.OPEN,
      },
    });

    for (const bet of bets) {
      await this.wingoService.settleBet(bet, result);
    }
  }
}

}
