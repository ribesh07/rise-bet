import { Controller, Put, Body, UseGuards, Request, Post , Get, Param, Req, UploadedFile, UseInterceptors} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../..//auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionDto } from './dto/transaction.dto';
import { BetDto } from './dto/bet.dto';
import { ResolveBetDto } from './dto/resolve-bet.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { CreatePromoDto } from './dto/create-promo.dto';
import { RedeemPromoDto } from './dto/redeem-promo.dto';

@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard) // protect this route
  @Post('update')
  async updateUser(@Request() req : any, @Body() body: UpdateUserDto) {
    // req.user comes from JwtStrategy.validate()
    const userId = req.user.id;

    return this.userService.update(userId, body);
  }

@UseGuards(JwtAuthGuard)
@Post('update-password')
async updatePassword(
  @Request() req: any,
  @Body() body: { oldPassword: string; newPassword: string }
) {
  const userId = req.user.id;
  return this.userService.updatePassword(userId, body.oldPassword, body.newPassword);
}


  @UseGuards(JwtAuthGuard)
  @Get(':id/details')
  async getUserDetails(@Param('id') id: string) {
    return this.userService.getUserWithDetails(Number(id));
  }

  // Users redeem promo
  @UseGuards(JwtAuthGuard)
  @Post('redeem-promo')
  async redeem(@Req() req, @Body() dto: RedeemPromoDto) {
    return this.userService.redeemPromo(req.user.id, dto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('wallets')
  async getUserWallets(@Request() req: any) {
    const userId = req.user.id;
    return this.userService.getUserWallets(Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/transaction')
  async addTransaction(
    @Param('id') id: string,
    @Body() dto: TransactionDto,
  ) {
    return this.userService.addTransaction(Number(id), dto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post(':id/bet')
  // async placeBet(
  //   @Param('id') id: string,
  //   @Body() dto: BetDto,
  // ) {
  //   return this.userService.placeBet(Number(id), dto);
  // }

  
  // @UseGuards(JwtAuthGuard)
  // @Post('bets/:betId/resolve')
  // async resolveBet(
  //   @Param('betId') betId: string,
  //   @Body() dto: ResolveBetDto,
  // ) {
  //   return this.userService.resolveBet(Number(betId), dto.status);
  // }

  //image upload
   @Post('upload-image/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const name = file.originalname.replace(/\.[^/.]+$/, ""); 
          const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
          const timestamp = Date.now();
          const ext = extname(file.originalname);

          cb(null, `${safeName}-${timestamp}${ext}`);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() file, @Req() req ,@Param('id') id: string) {
    const userId = Number(id);
      // delete old image FIRST
    await this.userService.deleteUserImage(userId);

    // update with new image path
    return this.userService.updateUserImage(userId, file.filename);
  }
}

