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
    this.logger.log('Socket.IO server set on RouletteService');
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
    if (this.io) {
      this.io.to(room).emit('countdown', { seconds: table.countdown });
      } else {
        this.logger.warn('Socket server not available; skipping emit');
      }

    if (table.countdown <= 0) {
      table.state = 'spinning';
      table.countdown = spinInterval / 1000; // reset for next round
      // perform spin
      const result = spinWheel();
      // fetch pending bets for this room/table (game='roulette' and match room)
      const pendingBets = await this.prisma.bet.findMany({
        where: { game: 'ROULETTE', status: BetStatus.PENDING,room },
      });
      console.log(`Spun wheel for table ${room}, result:`, result);
      console.warn(`Found ${pendingBets.length} pending bets to resolve`);
      console.dir(pendingBets);
      // resolve bets atomically per bet
      const resolutions : any = [];
      for (const bet of pendingBets) {
        console.log('Resolving bet:', bet);
        const payload = bet.payload as any;
        const multiplier = evaluateBet(payload, result);
        console.log(`Bet payload:`, payload, `=> multiplier:`, multiplier);
        if (multiplier > 0) {
          const payout = Number(bet.amount) * Number(multiplier);
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
                createdAt: new Date(),
                description: `Roulette win (betId:${bet.id})`,
              },
            });

            //match update for win
            const match = await tx.match.update({
              where: { id: bet.matchId },
              data: {
                status: 'WON',
              }
            });

            
            // credit wallet
            await tx.wallet.update({
              where: { userId_currency: { userId: bet.userId, currency: bet.currency } },
              data: { balance: { increment: payout }  },
            });
          });
          console.log(`Bet ${bet.id} won, payout: ${payout}`);
          // console.log(resolutions);
          resolutions.push({ betId: bet.id, status: 'WON', payout, userId: bet.userId });
        } else {

          // mark bet LOST
          await this.prisma.$transaction(async (tx) => {
            await tx.bet.update({ where: { id: bet.id }, data: { status: 'LOST', payout: bet.amount, updatedAt: new Date() }});
            // create transaction WIN
            await tx.transaction.create({
              data: {
                userId: bet.userId,
                type: TransactionType.LOST,
                amount: bet.amount,
                currency: bet.currency,
                createdAt: new Date(),
                description: `Roulette lost (betId:${bet.id})`,
              },
            });

              const match = await tx.match.update({
              where: { id: bet.matchId },
              data: {
                status: 'LOST',
              }
            });
            // // credit wallet
            // await tx.wallet.update({
            //   where: { userId_currency: { userId: bet.userId, currency: bet.currency } },
            //   data: { balance: { decrement : bet.amount }  },
            // });
          });

          console.log(`Bet ${bet.id} lost.`);
          // mark lost
          resolutions.push({ betId: bet.id, status: 'LOST' , userId: bet.userId });
        }
      }
      
      console.log(resolutions);
      // broadcast spin result + resolutions
      this.io.to(room).emit('spin-result', { result, resolutions });
    } 
  }

  // Called by gateway when user places bet
  // async placeBet(userId: number, room: string, betDto: any) {
  //   // validate betDto: stake positive, payload valid, currency exists, etc.
    
  //   const { amount, currency, payload } = betDto;
  //   if (!amount || amount <= 0) throw new Error('Invalid amount');

  //   // find wallet
  //   const wallet = await this.prisma.wallet.findUnique({ where: { userId_currency: { userId, currency } }});
  //   if (!wallet) throw new Error('Wallet not found');

  //   // perform conditional withdrawal using updateMany for atomic check
  //   const dec = await this.prisma.wallet.updateMany({
  //     where: { id: wallet.id, balance: { gte: amount } },
  //     data: { balance: { decrement: amount } },
  //   });

  //   if (dec.count === 0) {
  //     throw new Error('Insufficient balance');
  //   }

  //   // create bet record + transaction inside a tx
  //   const [createdBet, txRecord] = await this.prisma.$transaction([
  //     this.prisma.bet.create({
  //       data: {
  //           userId,
  //           matchId: 0, // no matchId for roulette; or use room hash
  //           game: 'ROULETTE',
  //           amount: amount,
  //           currency,
  //           payload,
  //           status: 'PENDING',
  //       },
  //     }),
  //     this.prisma.transaction.create({
  //       data: {
  //         userId,
  //         type: 'BET',
  //         amount: amount,
  //         currency,
  //         description: 'Roulette stake',
  //       },
  //     }),
  //   ]);

  //   return { bet: createdBet , transaction: txRecord };
  // }

async resolveBetsForTable(
  tableId: string,
  result: { number: number; color: 'RED' | 'BLACK' | 'GREEN' }
) {
  // 1️⃣ Fetch pending bets for this table
  const pendingBets = await this.prisma.bet.findMany({
    where: {
      room: tableId,
      game: 'ROULETTE',
      status: BetStatus.PENDING,
    },
  });
  console.log(`Resolving ${pendingBets} bets for table ${tableId} with result`, result);

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
      const payout = Number(bet.amount) * Number(multiplier);

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
    // create the spin result
    const result = spinWheel(); // { number, color: 'RED'|'BLACK'|'GREEN' }

    // resolve bets (DB operations, wallet updates)
    // const resolved = await this.resolveBetsForTable(tableId, result);

    const pendingBets = await this.prisma.bet.findMany({
        where: { game: 'ROULETTE', status: BetStatus.PENDING,room:tableId },
      });
      console.log(`Spun wheel for table ${tableId}, result:`, result);
      console.warn(`Found ${pendingBets.length} pending bets to resolve`);
      console.dir(pendingBets);
      // resolve bets atomically per bet
      const resolutions : any = [];
      for (const bet of pendingBets) {
        console.log('Resolving bet:', bet);
        const payload = bet.payload as any;
        const multiplier = evaluateBet(payload, result);
        console.log(`Bet payload:`, payload, `=> multiplier:`, multiplier);
        if (multiplier > 0) {
          const payout = Number(bet.amount) * Number(multiplier);
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
                createdAt: new Date(),
                description: `Roulette win (betId:${bet.id})`,
              },
            });
            // credit wallet
            await tx.wallet.update({
              where: { userId_currency: { userId: bet.userId, currency: bet.currency } },
              data: { balance: { increment: payout }  },
            });
          });
          console.log(`Bet ${bet.id} won, payout: ${payout}`);
          console.log(resolutions);
          resolutions.push({ betId: bet.id, status: 'WON', payout, userId: bet.userId });
        } else {

          // mark bet LOST
          await this.prisma.$transaction(async (tx) => {
            await tx.bet.update({ where: { id: bet.id }, data: { status: 'LOST', payout: bet.amount, updatedAt: new Date() }});
            // create transaction WIN
            await tx.transaction.create({
              data: {
                userId: bet.userId,
                type: TransactionType.LOST,
                amount: bet.amount,
                currency: bet.currency,
                createdAt: new Date(),
                description: `Roulette lost (betId:${bet.id})`,
              },
            });
            // credit wallet
            await tx.wallet.update({
              where: { userId_currency: { userId: bet.userId, currency: bet.currency } },
              data: { balance: { decrement : bet.amount }  },
            });
          });

          // mark lost
          resolutions.push({ betId: bet.id, status: 'LOST' , userId: bet.userId });
          console.log(`Bet ${bet.id} lost.`);
          console.log(resolutions);
        }
      }

    // broadcast if io available, otherwise just log
    console.log('Emitting spin-result for table', this.io ? 'with' : 'without', 'Socket.IO server');
    if (this.io) {
      try {
        console.log('Emitting spin-result via socket.io for table', tableId);
        this.io.to(tableId).emit('spin-result', {
          result,
          resolutions,
          triggeredBy: 'ADMIN',
        });
      } catch (err) {
        this.logger.error('Failed to emit spin-result via socket.io', err);
      }
    } else {
      this.logger.warn(
        `Socket.IO server not set — spin-result for ${tableId} not broadcasted.`
      );
    }

    return { result, resolutions };
  }


async addPlayerToMatch(
  room: string,
  player: { userId: number; username: string }
) {
  return this.prisma.$transaction(async (tx) => {
    // find active match
    let match = await tx.match.findFirst({
      where: {
        tableId: room,
        status: "ACTIVE",
        name: "ROULETTE",
      },
    });

    // create new match
    if (!match) {
      match = await tx.match.create({
        data: {
          tableId: room,
          name: "ROULETTE",
          status: "ACTIVE",
          startTime: new Date(),
          countPlayers: 1,
          players: {
            create: {
              userId: player.userId,
              username: player.username,
            },
          },
        },
      });

      return match;
    }

    // try adding player
    try {
      await tx.matchPlayer.create({
        data: {
          matchId: match.id,
          userId: player.userId,
          username: player.username,
        },
      });

      // increment count safely
      return tx.match.update({
        where: { id: match.id },
        data: {
          countPlayers: { increment: 1 },
        },
        include: {
          players: true,
        },
      });
    } catch (err) {
      // duplicate join (unique constraint)
      return tx.match.findUnique({
        where: { id: match.id },
        include: {
          players: true,
        },
      });
    }
  });
}



async createBet(data: { 
  matchId: number; 
  userId: number; 
  room: string; 
  payload: any; 
  amount: number; 
}) {
  const { userId, matchId, room, payload, amount } = data;
  const currency = payload.currency;

  return await this.prisma.$transaction(async (tx) => {

    // 1. Find wallet
    const wallet = await tx.wallet.findUnique({
      where: { userId_currency: { userId, currency } },
    });

   if (!wallet) throw new Error("Wallet not found");

   const rate = await tx.exchangeRate.findUnique({
    where: { currency },
  });

  if (!rate) {
    throw new Error(`Rate not found for ${currency}`);
  }

  const amountInINR = Number(amount) * Number(rate.rateInINR);
   
   
   // 2. Atomic balance check + decrement
   const dec = await tx.wallet.updateMany({
     where: { id: wallet.id, balance: { gte: amount } },
     data: { balance: { decrement: amount } },
    });
    
    if (dec.count === 0) throw new Error("Insufficient balance");
   

    // 3. Create bet record
    const createdBet = await tx.bet.create({
      data: {
        matchId,
        userId,
        room,
        payload,
        amount,
        amountInINR,
        game: payload.game,
        currency,
      },
    });

    // 4. Create transaction record
    const txRecord = await tx.transaction.create({
      data: {
        userId,
        type: TransactionType.BET,
        amount,
        currency,
        description: `Bet placed on ${payload.game}`,
      },
    });

    // 5. Return both
    return {
      success : true,
      message : 'Bet placed successfully',
      bet: createdBet,
      transaction: txRecord,
    };
  });
}


async getActiveMatch(room: string , name : string) {
  let match = await this.prisma.match.findFirst({
    where: {
      tableId: room,
      name : name,
      status: "ACTIVE"
    }
  });

  if (!match) {
    match = await this.prisma.match.create({
      data: {
        tableId: room,
        players: [],
        startTime: new Date(),
        name : name,
        status: "ACTIVE"
      }
    });
  }

  return match;
}


}
