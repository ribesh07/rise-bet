import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BetStatus,
  Prisma,
  RoundStatus,
  TransactionStatus,
  TransactionType,
  WingoBetType,
  WingoDuration,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PlaceWingoBetDto } from './dto/place-bet.dto';

@Injectable()
export class WingoService {
  constructor(private prisma: PrismaService) {}

  // ⏱ Duration → seconds
  durationToSeconds(d: WingoDuration) {
    return { S30: 30, M1: 60, M3: 180, M5: 300 }[d];
  }

  async getOrCreateWingoMatch(duration: WingoDuration, startTime: Date) {
  const existing = await this.prisma.match.findFirst({
    where: {
      name: 'WINGO',
      tableId: duration,
      startTime,
    },
  });

  if (existing) return existing;

  return this.prisma.match.create({
    data: {
      name: 'WINGO',
      tableId: duration,
      status: BetStatus.ACTIVE,
      startTime,
    },
  });
}


  // 🎯 Place bet
async placeBet(userId: number, dto: PlaceWingoBetDto) {
  const now = new Date();
  const endTime = new Date(
    now.getTime() + this.durationToSeconds(dto.duration) * 1000,
  );

  // 1️⃣ Wallet check
  const wallet = await this.prisma.wallet.findUnique({
    where: {
      userId_currency: {
        userId,
        currency: dto.currency,
      },
    },
  });

  if (!wallet || Number(wallet.balance) < Number(dto.amount)) {
    throw new BadRequestException('Insufficient balance');
  }

  // 2️⃣ Debit wallet
  await this.prisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: { decrement: dto.amount } },
  });

  // 3️⃣ Transaction
  await this.prisma.transaction.create({
    data: {
      userId,
      type: TransactionType.BET,
      currency: dto.currency,
      amount: new Prisma.Decimal(dto.amount),
      status: TransactionStatus.SUCCESS,
      description: 'Wingo bet placed',
    },
  });

  // 4️⃣ Create WingoBet
  const bet = await this.prisma.wingoBet.create({
    data: {
      userId,
      betType: dto.betType,
      value: dto.value,
      amount: dto.amount,
      currency: dto.currency,
      duration: dto.duration,
      status: RoundStatus.OPEN,
      startTime: now,
      endTime,
    },
  });

  // 5️⃣ Create / attach Match
  const match = await this.getOrCreateWingoMatch(dto.duration, now);

  await this.prisma.bet.create({
    data: {
      userId,
      matchId: match.id, // ✅ REAL FK
      uniqueBetId: bet.id,
      game: 'WINGO',
      currency: dto.currency,
      payload: { value: dto.value },
      amount: new Prisma.Decimal(dto.amount),
      status: BetStatus.ACTIVE,
    },
  });

  return bet;
}


  // 📊 Result API
  async getResult() {
    const round = await this.prisma.wingoBet.findMany({
    orderBy: {
      createdAt: 'desc', 
    },
    });

    if (!round) throw new NotFoundException();

    return round;
  }

  // 🧮 Settlement logic
async settleBet(bet: any, result: number) {
  let win = false;
  let multiplier = -1;

  // NUMBER
  if (bet.betType === WingoBetType.NUMBER && Number(bet.value) === result) {
    multiplier = 9;
    win = true;
  }

  // COLOR / BIG / SMALL (same logic you already wrote)

  const payout = win ? bet.amount * multiplier : 0;

  await this.prisma.wingoBet.update({
    where: { id: bet.id },
    data: {
      status: RoundStatus.SETTLED,
      result,
      win,
      payout,
    },
  });

  if (bet.currency) {
    if (win) {
      await this.prisma.wallet.updateMany({
        where: { userId: bet.userId, currency: bet.currency },
        data: { balance: { increment: payout } },
      });
    }

    await this.prisma.transaction.create({
      data: {
        userId: bet.userId,
        type: win ? TransactionType.WIN : TransactionType.LOST,
        currency: bet.currency,
        amount: new Prisma.Decimal(win ? payout : bet.amount),
        status: TransactionStatus.SUCCESS,
        description: win ? 'Wingo win' : 'Wingo loss',
      },
    });

    await this.prisma.bet.update({
      where: { uniqueBetId: bet.id },
      data: { status: win ? BetStatus.WON : BetStatus.LOST },
    });
  }
}


}
