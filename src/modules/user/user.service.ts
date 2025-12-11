import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../..//prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionType, BetStatus, UserRole } from '@prisma/client';
import { TransactionDto } from './dto/transaction.dto';
// import { BetDto } from './dto/bet.dto';
import { Currency } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as fs from 'fs';
import * as path from 'path';



@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto : CreateUserDto) {
    // hash
    console.table(dto);
   const { password, ...rest } = dto;
  const hashed = await bcrypt.hash(password, 10);

  const user = await this.prisma.user.create({
    data: {
      ...rest,
      password: hashed,
      role: dto.role ?? UserRole.USER, // default role
    },
  });

  // auto-create wallets

  const currencies: Currency[] = [
    Currency.INR,
    Currency.TRX,
    Currency.XRP,
    Currency.USDT,
    Currency.USDC,
    Currency.SOL,
    Currency.BNB,
    Currency.ETH,
    Currency.LTC,
    Currency.BTC
  ];  

  await this.prisma.wallet.createMany({
    data: currencies.map((currency) => ({
      userId: user.id,
      currency,
    })),
  });
  return user;

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


async updatePassword(id: number, oldPassword: string, newPassword: string) {
  if (!newPassword) return { success: false, message: 'New password cannot be empty' };

  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundException('User not found');

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) return { success: false, message: 'Old password is incorrect' };

  const hashedNew = await bcrypt.hash(newPassword, 10);

  await this.prisma.user.update({
    where: { id },
    data: { password: hashedNew },
  });

  return {
    success: true,
    message: 'Password updated successfully',
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
    const details = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        transactions: true,
         wallets: true,  
        bets: {
          include: {
            match: true, // fetch match info too
          },
        },
      },
    });
    const { password, ...rest } = details as any;
    return {
      success: true,
      data: rest,
    };
  }

  async redeemPromo(userId: number, dto: any) {
    const code = dto.code.toUpperCase();

    const promo = await this.prisma.promo.findUnique({
      where: { code },
    });

    if (!promo) return({ success: false, message: 'Invalid promo code' });
    if (promo.expiresAt && promo.expiresAt < new Date())
      return({ success: false, message: 'Promo code has expired' });

    if (promo.claimed >= promo.maxClaims)
      return({ success: false, message: 'Promo code claim limit reached' });

    // Check if user already used it
    const existingUsage = await this.prisma.promoUsage.findUnique({
      where: { promoId_userId: { promoId: promo.id, userId } },
    });
    if (existingUsage) return({ success: false, message: 'Promo code already used by you!' });

    // Transaction: add wallet amount + record usage + increment claimed
    return this.prisma.$transaction(async (tx) => {
      // Add to INR wallet
      await tx.wallet.updateMany({
        where: { userId, currency: 'INR' },
        data: {
          balance: {
            increment: promo.amount,
          },
        },
      });

      // Add usage record
      await tx.promoUsage.create({
        data: { userId, promoId: promo.id },
      });

      // Increase claimed count
      await tx.promo.update({
        where: { id: promo.id },
        data: { claimed: { increment: 1 } },
      });

      return { success: true, message: 'Promo applied successfully', amount: promo.amount };
    });
  }

  //helpers function
  async getWalletOrThrow(userId: number, currency: Currency) {
  const wallet = await this.prisma.wallet.findUnique({
    where: {
      userId_currency: { userId, currency },
    },
  });

  if (!wallet) throw new Error(`Wallet for ${currency} not found`);

  return wallet;
}

  //add transaction and update balance
async addTransaction(userId: number, dto: TransactionDto) {
  return this.prisma.$transaction(async (tx) => {
    // Get the correct wallet
    const wallet = await this.getWalletOrThrow(userId, dto.currency);

    const balanceUpdate =
      dto.type === TransactionType.DEPOSIT || dto.type === TransactionType.WIN
        ? { increment: dto.amount }
        : { decrement: dto.amount };

    // Update the wallet balance
    await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: balanceUpdate },
    });

    // Create a transaction record
    return tx.transaction.create({
      data: {
        userId,
        currency: dto.currency,
        type: dto.type,
        amount: dto.amount,
      },
    });
  });
}


  //for withdrawal
async createWithdrawal(userId: number, amount: number, currency: Currency) {
  return this.prisma.$transaction(async (tx) => {
    const wallet = await this.getWalletOrThrow(userId, currency);

    if (wallet.balance.lt(amount)) {
      return { success: false, message: 'Insufficient balance' };
    }

    // Create transaction
    await tx.transaction.create({
      data: {
        userId,
        currency,
        type: TransactionType.WITHDRAW,
        amount,
        status: 'SUCCESS',
      },
    });

    // Update wallet balance
    await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amount } },
    });

    return { success: true };
  });
}


//upload image
async updateUserImage(userId: number, filename: string) {
  const imagePath = `/uploads/users/${filename}`;

  return this.prisma.wallet.update({
    where: { id: userId },
    data: { image: imagePath },
  });
}


//delete image
 async deleteUserImage(userId: number) {
    const user = await this.prisma.wallet.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    if (!user?.image) return; // no image, nothing to delete

    const imagePath = path.join(process.cwd(), user.image);

    // check if file exists
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // delete file
      console.log('Deleted old image:', imagePath);
    }
  }



  //get wallets
 
//   async updateUserFiles(
//   userId: number,
//   files: {
//     profileImage?: Express.Multer.File[];
//     documents?: Express.Multer.File[];
//   }
// ) {
//     let profilePath: string | null = null;
//     let documentPaths: string[] | null = null;

//     //   console.log('Updating files for user:', userId);
//     // console.log('Received files:', files);

//     // ----- PROFILE -----
//     if (files.profileImage?.length) {
//       const file = files.profileImage[0];
//       profilePath = `/uploads/users/${userId}/${file.filename}`;
//     }

//     // ----- DOCUMENTS -----
//     if (files.documents?.length) {
//       documentPaths = files.documents.map(
//         (file) => `/uploads/documents/${userId}/${file.filename}`
//       );
//     }

//     // 🔥 FETCH OLD IMAGES FIRST
//     const previousUser = await this.prisma.user.findUnique({
//       where: { id: userId },
//       select: { profileImage: true, documentImages: true },
//     });

//     const data: any = {};
//     if (profilePath) data.profileImage = profilePath;
//     if (documentPaths) data.documentImages = documentPaths;

//     // 🔥 UPDATE USER FIRST (no FS work yet)
//     const updatedUser = await this.prisma.user.update({
//       where: { id: userId },
//       data,
//     });

//     // Return old + new paths so controller can delete FS
//     return {
//       success: true,
//       message: "User files updated",
//       newProfile: profilePath,
//       newDocuments: documentPaths,
//       oldProfile: previousUser?.profileImage,
//     };
// }

async updateUserFiles(
    userId: number,
    files: {
      profileImage?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    let profilePath: string | null = null;
    let documentPaths: string[] | null = null;

    // ----- PROFILE -----
    if (files.profileImage?.length) {
      const file = files.profileImage[0];
      // Store relative path consistently
      profilePath = `/uploads/users/${userId}/profile/${file.filename}`;
    }

    // ----- DOCUMENTS -----
    if (files.documents?.length) {
      documentPaths = files.documents.map(
        (file) => `/uploads/users/${userId}/documents/${file.filename}`,
      );
    }

    // 🔥 FETCH OLD FILES FIRST
    const previousUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { profileImage: true, documentImages: true },
    });

    if (!previousUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Prepare update data
    const data: any = {};
    if (profilePath) data.profileImage = profilePath;
    if (documentPaths) {
      // Replace all documents (or append based on your logic)
      data.documentImages = documentPaths;
    }

    // 🔥 UPDATE DB
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    // Return old + new paths for cleanup
    return {
      success: true,
      message: 'User files updated successfully',
      newProfile: profilePath,
      newDocuments: documentPaths,
      oldProfile: previousUser.profileImage,
      oldDocuments: previousUser.documentImages, // 🔥 ADDED THIS
    };
  }


  async getUserWallets(userId: number) {
    return this.prisma.wallet.findMany({
      where: { userId },
    });
  }

  //eol
}
