import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { spinWheel, evaluateBet } from './roulette.utils';
import { Server } from 'socket.io';
import { BetStatus, TransactionType } from '@prisma/client';

type Table = {
  room: string;
  intervalId?: NodeJS.Timeout;
  state: 'waiting' | 'spinning' | 'settling';
  countdown: number;
};

@Injectable()
export class RouletteService {
  private readonly logger = new Logger(RouletteService.name);
  private tables = new Map<string, Table>();
  private io: Server; // set by gateway constructor after creation

  constructor(private readonly prisma: PrismaService) {}

  setServer(io: Server) {
    this.io = io;
  }

  createTable(room: string, spinInterval = 15000) {
    if (this.tables.has(room)) return;
    const table: Table = { room, state: 'waiting', countdown: spinInterval / 1000 };
    table.intervalId = setInterval(() => this.gameLoop(room, spinInterval), 1000);
    this.tables.set(room, table);
    this.logger.log(`Table ${room} created`);
  }

  destroyTable(room: string) {
    const t = this.tables.get(room);
    if (!t) return;
    clearInterval(t.intervalId);
    this.tables.delete(room);
  }

  private async gameLoop(room: string, spinInterval: number) {
    const table = this.tables.get(room);
    if (!table) return;
    table.countdown -= 1;
    // broadcast countdown
    this.io.to(room).emit('countdown', { seconds: table.countdown });

    if (table.countdown <= 0) {
      table.state = 'spinning';
      table.countdown = spinInterval / 1000; // reset for next round
      // perform spin
      const result = spinWheel();
      // fetch pending bets for this room/table (game='roulette' and match room)
      const pendingBets = await this.prisma.bet.findMany({
        where: { game: 'roulette', status: 'PENDING', /* optionally: matchId or room marker in payload */ },
      });
      // resolve bets atomically per bet
      const resolutions : any = [];
      for (const bet of pendingBets) {
        const payload = bet.payload as any;
        const multiplier = evaluateBet(payload, result);
        if (multiplier > 0) {
          const payout = Number(bet.stake) * Number(multiplier);
          // update DB atomic: set bet won, create transaction, credit wallet
          await this.prisma.$transaction(async (tx) => {
            // mark bet won
            await tx.bet.update({ where: { id: bet.id }, data: { status: 'WON', payout: payout, updatedAt: new Date() }});
            // create transaction WIN
            await tx.transaction.create({
              data: {
                userId: bet.userId,
                type: 'WIN',
                amount: payout,
                currency: bet.currency,
                description: `Roulette win (betId:${bet.id})`,
              },
            });
            // credit wallet
            await tx.wallet.update({
              where: { userId_currency: { userId: bet.userId, currency: bet.currency } },
              data: { balance: { increment: payout } },
            });
          });
          resolutions.push({ betId: bet.id, status: 'WON', payout });
        } else {
          // mark lost
          await this.prisma.bet.update({ where: { id: bet.id }, data: { status: 'LOST', updatedAt: new Date() }});
          resolutions.push({ betId: bet.id, status: 'LOST' });
        }
      }

      // broadcast spin result + resolutions
      this.io.to(room).emit('spin-result', { result, resolutions });
    } 
  }

  // Called by gateway when user places bet
  async placeBet(userId: number, room: string, betDto: any) {
    // validate betDto: stake positive, payload valid, currency exists, etc.
    
    const { stake, currency, payload } = betDto;
    if (!stake || stake <= 0) throw new Error('Invalid stake');

    // find wallet
    const wallet = await this.prisma.wallet.findUnique({ where: { userId_currency: { userId, currency } }});
    if (!wallet) throw new Error('Wallet not found');

    // perform conditional withdrawal using updateMany for atomic check
    const dec = await this.prisma.wallet.updateMany({
      where: { id: wallet.id, balance: { gte: stake } },
      data: { balance: { decrement: stake } },
    });

    if (dec.count === 0) {
      throw new Error('Insufficient balance');
    }

    // create bet record + transaction inside a tx
    const [createdBet, txRecord] = await this.prisma.$transaction([
      this.prisma.bet.create({
        data: {
            userId,
            matchId: 0, // no matchId for roulette; or use room hash
            game: 'roulette',
            stake,
            currency,
            payload,
            status: 'PENDING',
        },
      }),
      this.prisma.transaction.create({
        data: {
          userId,
          type: 'BET',
          amount: stake,
          currency,
          description: 'Roulette stake',
        },
      }),
    ]);

    return { bet: createdBet };
  }

async resolveBetsForTable(
  tableId: string,
  result: { number: number; color: 'RED' | 'BLACK' | 'GREEN' }
) {
  // 1️⃣ Fetch pending bets for this table
  const pendingBets = await this.prisma.bet.findMany({
    where: {
      table: tableId,
      game: 'roulette',
      status: BetStatus.PENDING,
    },
  });

  // 2️⃣ typed resolution array to avoid "never[]" error
  const resolutions: {
    betId: number;
    status: string;
    payout?: number;
    userId: number;
  }[] = [];

  // 3️⃣ Resolve each bet
  for (const bet of pendingBets) {
    const payload = bet.payload as any;

    // Calculate win multiplier (straight = 35x, red/black = 1x, lose = -1)
    const multiplier = evaluateBet(payload, result);

    if (multiplier > 0) {
      // WIN
      const payout = Number(bet.stake) * Number(multiplier);

      await this.prisma.$transaction(async (tx) => {
        // Update bet status
        await tx.bet.update({
          where: { id: bet.id },
          data: {
            status: BetStatus.WON,
            payout: payout,
            updatedAt: new Date(),
          },
        });

        // Log win transaction
        await tx.transaction.create({
          data: {
            userId: bet.userId,
            type: TransactionType.WIN,
            amount: payout,
            currency: bet.currency,
            description: `Roulette win (betId=${bet.id})`,
          },
        });

        // Credit wallet
        await tx.wallet.update({
          where: {
            userId_currency: {
              userId: bet.userId,
              currency: bet.currency,
            },
          },
          data: { balance: { increment: payout } },
        });
      });

      resolutions.push({
        betId: bet.id,
        status: 'WON',
        payout,
        userId: bet.userId,
      });

    } else {
      // LOSS
      await this.prisma.bet.update({
        where: { id: bet.id },
        data: {
          status: BetStatus.LOST,
          payout: 0,
          updatedAt: new Date(),
        },
      });

      resolutions.push({
        betId: bet.id,
        status: 'LOST',
        userId: bet.userId,
      });
    }
  }

  return resolutions;
}

  // admin/force spin
  async spinNow(room: string) {
    const result = spinWheel();
    // very similar resolution as in gameLoop; you may reuse code to avoid duplication
    // for brevity, call gameLoop immediate resolution (but avoid altering countdown here)
    // Simplest: call the game loop resolution path manually (not ideal but ok)
    // Implementation left similar to gameLoop
    return result;
  }

  //admin get table state
  async forceSpin(tableId: string) {
  const result = spinWheel(); // generate random result
  const resolved = await this.resolveBetsForTable(tableId, result);

  // Notify WebSocket room
  this.io.to(tableId).emit('spin-result', {
    result,
    triggeredBy: 'ADMIN',
    resolved
  });

  return {
    message: "Spin forced",
    table: tableId,
    result,
    resolved
  };
}

}
