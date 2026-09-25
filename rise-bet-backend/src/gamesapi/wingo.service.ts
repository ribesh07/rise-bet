import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BetStatus,
  CoinSide,
  Prisma,
  RoundStatus,
  TransactionStatus,
  TransactionType,
  WingoBetType,
  WingoDuration,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PlaceWingoBetDto } from './dto/place-bet.dto';
import { randomInt } from 'crypto';
import { PlaceLimboBetDto } from './dto/place-limbo.dto';
import { PlaceCoinflipBetDto } from './dto/place-coinflip.dto';
import { PlaceRpsBetDto, RpsChoice } from './dto/place-rps.dto';
import { PlacePumpBetDto } from './dto/place-pump.dto';
import { PumpPayload } from './entities/pump.etity';

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
  async getResult(userId : any) {
    const round = await this.prisma.wingoBet.findMany({
      where : {
          userId: Number(userId)
      },
    orderBy: {
      createdAt: 'desc', 
    },
    });

    if (!round) throw new NotFoundException();

    return {
      success : true,
      data : round};
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

    // ---------------- NUMBER ----------------
    if (bet.betType === WingoBetType.NUMBER) {
      if (Number(bet.value) === result) {
        multiplier = 9;
        win = true;
      }
    }

    // ---------------- COLOR & BIG/SMALL ----------------
    if (bet.betType === WingoBetType.COLOR) {
      const v = bet.value.toLowerCase();

      // ---- GREEN ----
      if (v === 'green') {
        if ([1, 3, 7, 9].includes(result)) multiplier = 2;
        if (result === 5) multiplier = 1.5;
      }

      // ---- RED ----
      if (v === 'red') {
        if ([2, 4, 6, 8].includes(result)) multiplier = 2;
        if (result === 0) multiplier = 1.5;
      }

      // ---- VIOLET / PURPLE ----
      if (v === 'violet' || v === 'purple') {
        if ([0, 5].includes(result)) multiplier = 4.5;
      }

      // ---- BIG / SMALL ----
      if (v === 'big') {
        if (result >= 5 && result <= 9) multiplier = 2;
      }

      if (v === 'small') {
        if (result >= 0 && result <= 4) multiplier = 2;
      }

      if (multiplier > 0) win = true;
    }

    // ---------------- PAYOUT ----------------
  

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


//limbo
  // 🎲 Generate Limbo roll (provably replaceable later)
generateRoll(): number {
  const r = randomInt(1, 100_000_000); // 1 → 100M
  const houseEdge = 0.01; // 1%

  // core limbo formula
  const multiplier = (1 - houseEdge) / (r / 100_000_000);

  // clamp & format
  return Number(
    Math.min(multiplier, 100).toFixed(2)
  );
}


  async placeBetLimbo(userId: number, dto: PlaceLimboBetDto) {
    // 1️⃣ Wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userId_currency: {
          userId,
          currency: dto.currency,
        },
      },
    });

    if (!wallet || Number(wallet.balance) < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // 2️⃣ Debit wallet
    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: dto.amount } },
    });

    // 3️⃣ Create Match (ONE per bet)
    const match = await this.prisma.match.create({
      data: {
        name: 'LIMBO',
        tableId: 'LIMBO',
        status: BetStatus.SPINNING,
        startTime: new Date(),
      },
    });

    // 4️⃣ Roll
    const roll = this.generateRoll();
    const win = roll >= dto.targetMultiplier;
    const payout = win ? dto.amount * dto.targetMultiplier : 0;

    // 5️⃣ Create Bet
    const bet = await this.prisma.bet.create({
      data: {
        userId,
        matchId: match.id,
        game: 'LIMBO',
        currency: dto.currency,
        amount: new Prisma.Decimal(dto.amount),
        payout: new Prisma.Decimal(payout),
        odds : roll,
        status: win ? BetStatus.WON : BetStatus.LOST,
        payload: {
          targetMultiplier: dto.targetMultiplier,
          roll,
          winChance: Number((99 / dto.targetMultiplier).toFixed(4)),
        },
      },
    });

    // 6️⃣ Wallet + Transaction
    if (win) {
      await this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: payout } },
      });

      await this.prisma.transaction.create({
        data: {
          userId,
          type: TransactionType.WIN,
          currency: dto.currency,
          amount: new Prisma.Decimal(payout),
          status: TransactionStatus.SUCCESS,
          description: 'Limbo win',
        },
      });
    } else {
      await this.prisma.transaction.create({
        data: {
          userId,
          type: TransactionType.LOST,
          currency: dto.currency,
          amount: new Prisma.Decimal(dto.amount),
          status: TransactionStatus.SUCCESS,
          description: 'Limbo loss',
        },
      });
    }

    // 7️⃣ Finish match
    await this.prisma.match.update({
      where: { id: match.id },
      data: {
        status: BetStatus.FINISHED,
        endTime: new Date(),
      },
    });

    return {
      success : true,
      data : {
        result: win ? 'WIN' : 'LOSE',
        multiplier : roll,
        targetMultiplier: dto.targetMultiplier,
        payout,
        profit: payout - dto.amount,
        betId: bet.id,
      }
      
    };
  }

   async getLimboResult(userId : any) {
    const round = await this.prisma.bet.findMany({
      where : {
        game : 'LIMBO',
       userId: Number(userId)
      },
    orderBy: {
      createdAt: 'desc', 
    },
    });

    if (!round) throw new NotFoundException();

    return {
      success : true,
      data : round};
  }

//coinflip


   // 🎲 Secure coin flip
  flipCoin(): CoinSide {
    return Math.random() < 0.5 ? CoinSide.HEAD : CoinSide.TAIL;
  }

  async placecoinflipBet(userId: number, dto: PlaceCoinflipBetDto) {
    // 1️⃣ Wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userId_currency: {
          userId,
          currency: dto.currency,
        },
      },
    });

    if (!wallet || Number(wallet.balance) < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // 2️⃣ Get streak
    const stats = await this.prisma.userGameStats.findUnique({
      where: { userId },
    });

    const currentStreak = stats?.consecutiveWins ?? 0;

    // 3️⃣ Multiplier doubles per win
    const multiplier = Math.pow(2, currentStreak + 1);

    // 4️⃣ Debit wallet
    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: dto.amount } },
    });

    // 5️⃣ Create Match
    const match = await this.prisma.match.create({
      data: {
        name: 'COINFLIP',
        tableId: 'COINFLIP',
        status: BetStatus.SPINNING,
        startTime: new Date(),
      },
    });

    // 6️⃣ Flip result
    const result = this.flipCoin();
    const win = dto.choice === result;
    const payout = win ? dto.amount * multiplier : 0;

    // 7️⃣ Create Bet
    const bet = await this.prisma.bet.create({
      data: {
        userId,
        matchId: match.id,
        game: 'COINFLIP',
        currency: dto.currency,
        amount: new Prisma.Decimal(dto.amount),
        payout: new Prisma.Decimal(payout),
        status: win ? BetStatus.WON : BetStatus.LOST,
        payload: {
          choice: dto.choice,
          result,
          streakBefore: currentStreak,
          multiplier,
        },
      },
    });

    // 8️⃣ Update streak
    if (win) {
      await this.prisma.userGameStats.upsert({
        where: { userId },
        update: {
          consecutiveWins: currentStreak + 1,
          totalGames: { increment: 1 },
          lastResult: 'WIN',
        },
        create: {
          userId,
          game: 'COINFLIP',
          consecutiveWins: 1,
          totalGames: 1,
          lastResult: 'WIN',
        },
      });
    } else {
      await this.prisma.userGameStats.upsert({
        where: { userId },
        update: {
          consecutiveWins: 0,
          totalGames: { increment: 1 },
          lastResult: 'LOSE',
        },
        create: {
          userId,
          game: 'COINFLIP',
          consecutiveWins: 0,
          totalGames: 1,
          lastResult: 'LOSE',
        },
      });
    }

    // 9️⃣ Wallet + transaction
    if (win) {
      await this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: payout } },
      });

      await this.prisma.transaction.create({
        data: {
          userId,
          type: TransactionType.WIN,
          currency: dto.currency,
          amount: new Prisma.Decimal(payout),
          status: TransactionStatus.SUCCESS,
          description: 'Coinflip win',
        },
      });
    } else {
      await this.prisma.transaction.create({
        data: {
          userId,
          type: TransactionType.LOST,
          currency: dto.currency,
          amount: new Prisma.Decimal(dto.amount),
          status: TransactionStatus.SUCCESS,
          description: 'Coinflip loss',
        },
      });
    }

    // 🔟 Finish match
    await this.prisma.match.update({
      where: { id: match.id },
      data: {
        status: BetStatus.FINISHED,
        endTime: new Date(),
      },
    });

    return {
      success : true,
      data :{result,
      win,
      multiplier,
      payout,
      profit: payout - dto.amount,
      streak: win ? currentStreak + 1 : 0,
      betId: bet.id,}
    };
  }

  // COINFLIP
     async getCoinflipResult(userId : any) {
    const round = await this.prisma.bet.findMany({
      where : {
        game : 'COINFLIP',
       userId: Number(userId)
      },
    orderBy: {
      createdAt: 'desc', 
    },
    });

    if (!round) throw new NotFoundException();

    return {
      success : true,
      data : round};
  }

  //RPS game


  private getHousePick(): RpsChoice {
    const arr = [RpsChoice.ROCK, RpsChoice.PAPER, RpsChoice.SCISSORS];
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private getRPSResult(player: RpsChoice, house: RpsChoice) {
    if (player === house) return 'draw';
    if (
      (player === RpsChoice.ROCK && house === RpsChoice.SCISSORS) ||
      (player === RpsChoice.PAPER && house === RpsChoice.ROCK) ||
      (player === RpsChoice.SCISSORS && house === RpsChoice.PAPER)
    ) {
      return 'win';
    }
    return 'lose';
  }

  private multiplierFor(streak: number): number {
    if (streak === 0) return 1;
    return Number((1.6 * Math.pow(2, streak - 1)).toFixed(2));
  }

  // 🎮 PLAY ROUND
  async play(userId: number, dto: PlaceRpsBetDto) {

    // 1️⃣ Find active RPS match
    let match = await this.prisma.match.findFirst({
      where: {
        userId,
        name: 'RPS',
        status: BetStatus.ACTIVE,
      },
    });

    // 2️⃣ New game → debit wallet once
    if (!match) {
      const wallet = await this.prisma.wallet.findUnique({
        where: {
          userId_currency: {
            userId,
            currency: dto.currency,
          },
        },
      });
   

      if (!wallet || Number(wallet.balance) < dto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      await this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: dto.amount } },
      });

      match = await this.prisma.match.create({
        data: {
          userId,
          name: 'RPS',
          tableId: 'RPS',
          status: BetStatus.ACTIVE,
          startTime: new Date(),
        },
      });
    }

  
    const streak = match.wins ?? 0;
    const multiplier = this.multiplierFor(streak);

    const house = this.getHousePick();
    const result = this.getRPSResult(dto.choice, house);

    // 3️⃣ DRAW → no bet settlement
    if (result === 'draw') {
      return { match : match, result: 'draw', house };
    }

    // 4️⃣ Record bet
     let betdata = await this.prisma.bet.create({
      data: {
        userId,
        matchId: match.id,
        game: 'RPS',
        currency: dto.currency,
        amount: new Prisma.Decimal(dto.amount),
        payout: 0,
        status: result === 'win' ? BetStatus.WON : BetStatus.LOST,
        payload: {
          player: dto.choice,
          house,
          multiplier,
        },
      },
    });

    // 5️⃣ WIN → increment streak
    if (result === 'win') {
      await this.prisma.match.update({
        where: { id: match.id },
        data: { wins: streak + 1 },
      });

      return {
        match,
        result: 'WON',
        house,
        streak: streak + 1,
        multiplier,
      };
    }

    // 6️⃣ LOSE → end game
    await this.prisma.match.update({
      where: { id: match.id },
      data: {
        status: BetStatus.FINISHED,
        endTime: new Date(),
      },
    });

    await this.prisma.transaction.create({
      data: {
        userId,
        type: TransactionType.LOST,
        currency: dto.currency,
        amount: new Prisma.Decimal(dto.amount),
        status: TransactionStatus.SUCCESS,
        description: 'RPS loss',
      },
    });

    return {
      match,
      result: 'LOST',
      house,
      streak: 0,
    };
  }

  // 💰 CASH OUT
  async cashOut(userId: number, matchId: number) {
    const match = await this.prisma.match.findFirst({
      where: {
        id: matchId,
        userId,
        status: BetStatus.ACTIVE,
      },
    });

    if (!match) {
      throw new BadRequestException('No active game');
    }

    const streak = match.wins ?? 0;
    const multiplier = this.multiplierFor(streak);

    if (match.status !== BetStatus.ACTIVE) {
  throw new BadRequestException('Already settled');
}
    const betAmount = await this.prisma.bet.findFirst({
      where: { matchId },
      orderBy: { createdAt: 'asc' },
    });

    if (!betAmount) {
      throw new BadRequestException('Invalid game state');
    }

    const payout = Number(betAmount.amount) * multiplier;

    await this.prisma.wallet.updateMany({
      where: {
        userId,
        currency: betAmount.currency,
      },
      data: {
        balance: { increment: payout },
      },
    });

    await this.prisma.transaction.create({
      data: {
        userId,
        type: TransactionType.WIN,
        currency: betAmount.currency,
        amount: new Prisma.Decimal(payout),
        status: TransactionStatus.SUCCESS,
        description: 'RPS cash out',
      },
    });

    await this.prisma.match.update({
      where: { id: matchId },
      data: {
        status: BetStatus.FINISHED,
        endTime: new Date(),
      },
    });

    return {
      success : true,
      data : {
        match,
        payout,
        multiplier,
        streak,
      }
    };
  }

    // RPS
     async getRPSResultHistory(userId : any) {
    const round = await this.prisma.bet.findMany({
      where : {
        game : 'RPS',
       userId: Number(userId)
      },
    orderBy: {
      createdAt: 'desc', 
    },
    });

    if (!round) throw new NotFoundException();

    return {
      success : true,
      data : round};
  }


  //pump game

DIFFICULTY = {
  Easy:   { base: 0.01, inc: 0.008, max: 50 },
  Medium: { base: 0.02, inc: 0.015, max: 100 },
  Hard:   { base: 0.03, inc: 0.025, max: 200 },
};


  // 1️⃣ START GAME (BET)
  async startPump(userId: number, dto: PlacePumpBetDto) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userId_currency: {
          userId,
          currency: dto.currency,
        },
      },
    });

    if (!wallet || Number(wallet.balance) < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Deduct ONCE
    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: dto.amount } },
    });

    // Create Match
    const match = await this.prisma.match.create({
      data: {
        userId,
        name: 'PUMP',
        tableId: 'PUMP',
        status: BetStatus.ACTIVE,
        startTime: new Date(),
        wins: 0,
      },
    });

    // Create Bet (LOCKED STAKE)
    await this.prisma.bet.create({
      data: {
        userId,
        matchId: match.id,
        game: 'PUMP',
        currency: dto.currency,
        amount: new Prisma.Decimal(dto.amount),
        payout: new Prisma.Decimal(0),
        status: BetStatus.ACTIVE,
        payload: {
          difficulty: dto.difficulty,
          multiplier: 1,
          popped: false,
        },
      },
    });

    return {
      matchId: match.id,
      multiplier: 1,
    };
  }

  // 2️⃣ PUMP
async pump(userId: number, matchId: number) {
  const bet = await this.prisma.bet.findFirst({
    where: {
      matchId,
      userId,
      status: BetStatus.ACTIVE,
      game: 'PUMP',
    },
  });

  if (!bet) throw new BadRequestException('No active pump game');

  const payload = bet.payload as PumpPayload;
  const settings = this.DIFFICULTY[payload.difficulty];

  const popChance =
    settings.base + (payload.multiplier - 1) * settings.inc;

  const popped = Math.random() < popChance;

  // 💥 POPPED
  if (popped) {
    await this.prisma.bet.update({
      where: { id: bet.id },
      data: {
        status: BetStatus.LOST,
        payload: {
          ...payload,
          popped: true,
        },
      },
    });

    await this.prisma.match.update({
      where: { id: matchId },
      data: {
        status: BetStatus.FINISHED,
        endTime: new Date(),
      },
    });

    return {
      result: 'LOST',
      multiplier: payload.multiplier,
    };
  }

  // ✅ SAFE
  const newMultiplier = Number((payload.multiplier + 0.1).toFixed(2));

  const betupdate = await this.prisma.bet.update({
    where: { id: bet.id },
    data: {
      payload: {
        ...payload,
        multiplier: newMultiplier,
      },
    },
  });

  return {
    success : true,
    data : {
      betupdate,
    result: 'SAFE',
    multiplier: newMultiplier,
    profit: Number(bet.amount) * (newMultiplier - 1),}
  };
}


  // 3️⃣ CASH OUT
  async cashOutPump(userId: number, matchId: number) {
    const bet = await this.prisma.bet.findFirst({
      where: {
        matchId,
        userId,
        status: BetStatus.ACTIVE,
        game: 'PUMP',
      },
    });

    if (!bet) throw new BadRequestException('No active game');

    const { multiplier } = bet.payload as any;
    const payout = Number(bet.amount) * multiplier;

   const wallet =  await this.prisma.wallet.updateMany({
      where: {
        userId,
        currency: bet.currency,
      },
      data: {
        balance: { increment: payout },
      },
    });

    const transactiondetails =  await this.prisma.transaction.create({
      data: {
        userId,
        type: TransactionType.WIN,
        currency: bet.currency,
        amount: new Prisma.Decimal(payout),
        status: TransactionStatus.SUCCESS,
        description: 'Pump cash out',
      },
    });

   const betupdate =  await this.prisma.bet.update({
      where: { id: bet.id },
      data: {
        status: BetStatus.WON,
        payout: new Prisma.Decimal(payout),
      },
    });

    await this.prisma.match.update({
      where: { id: matchId },
      data: {
        status: BetStatus.FINISHED,
        endTime: new Date(),
      },
    });

    return {
      success: true,
      data :{
        wallet,
        betupdate,
        transactiondetails,
      payout,
      multiplier,}
    };
  }


     // RPS
     async getPumpResultHistory(userId : any) {
    const round = await this.prisma.bet.findMany({
      where : {
        game : 'PUMP',
       userId: Number(userId)
      },
    orderBy: {
      createdAt: 'desc', 
    },
    });

    if (!round) throw new NotFoundException();

    return {
      success : true,
      data : round};
  }


  //eol

}



