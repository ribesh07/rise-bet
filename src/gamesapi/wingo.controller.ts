import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WingoService } from './wingo.service';
import { PlaceWingoBetDto } from './dto/place-bet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { randomInt } from 'crypto';
import { PlaceLimboBetDto } from './dto/place-limbo.dto';
import { PlaceCoinflipBetDto } from './dto/place-coinflip.dto';
import { PlaceRpsBetDto } from './dto/place-rps.dto';

@Controller('api/v1/game')
@UseGuards(JwtAuthGuard)
export class WingoController {
  constructor(private readonly wingoService: WingoService) {}


  // 🔹 Place bet
  @Post('wingo/bet')
  placeBet(@Req() req : any, @Body() dto: PlaceWingoBetDto) {
    return this.wingoService.placeBet(req.user.id, dto);
  }

  // 🔹 Get result
  @Get('wingo/result')
  getResult(@Req() req:any) {
    return this.wingoService.getResult(req.user.id);
  }

  // 🔹 Get result getLimboResult
  @Get('limbo/result')
  getLimboResult(@Req() req:any) {
    return this.wingoService.getLimboResult(req.user.id);
  }


  // limbo
  @Post('limbo/bet')
  placeBetLimbo(@Req() req:any, @Body() dto: PlaceLimboBetDto) {
    return this.wingoService.placeBetLimbo(req.user.id, dto);
  }

  // coinflip
  @Post('coinflip/bet')
  placecoinflipBet(@Req() req, @Body() dto: PlaceCoinflipBetDto) {
    return this.wingoService.placecoinflipBet(req.user.id, dto);
  }

   // 🔹 Get result getCoinflipResult
  @Get('coinflip/result')
  getCoinflipResult(@Req() req:any) {
    return this.wingoService.getCoinflipResult(req.user.id);
  }

  //RPS
  @Post('rps/play')
  play(@Req() req : any, @Body() dto: PlaceRpsBetDto) {
    return this.wingoService.play(req.user.id, dto);
  }

  @Post('rps/cashout')
  cashOut(@Req() req : any, @Body('matchId') matchId: number) {
    return this.wingoService.cashOut(req.user.id, matchId);
  }

   // 🔹 Get result getRPSResultHistory
  @Get('rps/result')
  getRPSResultHistory(@Req() req:any) {
    return this.wingoService.getRPSResultHistory(req.user.id);
  }
}

