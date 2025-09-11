import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionType, BetStatus } from '@prisma/client';
import { TransactionDto } from './dto/transaction.dto';
import { BetDto } from './dto/bet.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(email: string, password: string , username: string , dob: string , phone?: string , referral?: string) {
    // hash
    console.log({email, password , username , dob , phone , referral});
    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashed,
        username : username,
        dob : dob,
        phone : phone,
        referral : referral,
      },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, ...rest } = updatedUser as any;
    return {
      success: true,
      message: 'User updated successfully',
      data: rest,
    };
  }

  async findByEmail(email?: string ) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUserName(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  //shows all details
  async getUserWithDetails(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },

      include: {
        transactions: true,
        bets: {
          include: {
            match: true, // fetch match info too
          },
        },
      },
    });
  }

  //add transaction and update balance
  async addTransaction(userId: number, dto: TransactionDto) {
    const balanceUpdate =
      dto.type === TransactionType.DEPOSIT || dto.type === TransactionType.WIN
        ? { increment: dto.amount }
        : { decrement: dto.amount };

    return this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          userId,
          type: dto.type,
          amount: dto.amount,
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          balance: balanceUpdate,
        },
      }),
    ]);
  }

  // place bet, deduct stake, record transaction
  async placeBet(userId: number, betDto: BetDto) {
    const potentialWin = betDto.stake * betDto.odds;

    return this.prisma.$transaction([
      // Deduct stake from balance
      this.prisma.user.update({
        where: { id: userId },
        data: {
          balance: { decrement: betDto.stake },
        },
      }),

      // Record transaction
      this.prisma.transaction.create({
        data: {
          userId,
          type: TransactionType.BET,
          amount: betDto.stake,
        },
      }),

      // Record bet
      this.prisma.bet.create({
        data: {
          userId,
          matchId: betDto.matchId,
          stake: betDto.stake,
          odds: betDto.odds,
          potentialWin,
          status: BetStatus.PENDING,
        },
      }),
    ]);
  }

  async resolveBet(betId: number, status: BetStatus) {
    const bet = await this.prisma.bet.findUnique({
      where: { id: betId },
    });

    if (!bet) throw new Error('Bet not found');

    if (status === BetStatus.WON) {
      return this.prisma.$transaction([
        this.prisma.bet.update({
          where: { id: betId },
          data: { status: BetStatus.WON },
        }),
        this.prisma.transaction.create({
          data: {
            userId: bet.userId,
            type: TransactionType.WIN,
            amount: bet.potentialWin,
          },
        }),
        this.prisma.user.update({
          where: { id: bet.userId },
          data: {
            balance: { increment: bet.potentialWin },
          },
        }),
      ]);
    } else {
      return this.prisma.bet.update({
        where: { id: betId },
        data: { status: BetStatus.LOST },
      });
    }
  }

  //eol
}
