import { Controller, Put, Body, UseGuards, Request, Post , Get, Param} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionDto } from './dto/transaction.dto';
import { BetDto } from './dto/bet.dto';
import { ResolveBetDto } from './dto/resolve-bet.dto';

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
  

}
