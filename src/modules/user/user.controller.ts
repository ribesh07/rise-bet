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
  @Get(':id/details')
  async getUserDetails(@Param('id') id: string) {
    return this.userService.getUserWithDetails(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/transaction')
  async addTransaction(
    @Param('id') id: string,
    @Body() dto: TransactionDto,
  ) {
    return this.userService.addTransaction(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/bet')
  async placeBet(
    @Param('id') id: string,
    @Body() dto: BetDto,
  ) {
    return this.userService.placeBet(Number(id), dto);
  }

  
  @UseGuards(JwtAuthGuard)
  @Post('bets/:betId/resolve')
  async resolveBet(
    @Param('betId') betId: string,
    @Body() dto: ResolveBetDto,
  ) {
    return this.userService.resolveBet(Number(betId), dto.status);
  }

  //image upload
   @Post('upload-image/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() file, @Req() req ,@Param('id') id: string) {
    const userId = Number(id);
    return this.userService.updateUserImage(userId, file.filename);
  }
}
