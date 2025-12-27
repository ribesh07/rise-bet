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

@Controller('wingo')
export class WingoController {
  constructor(private readonly wingoService: WingoService) {}


  // 🔹 Place bet
  @UseGuards(JwtAuthGuard)
  @Post('bet')
  placeBet(@Req() req : any, @Body() dto: PlaceWingoBetDto) {
    return this.wingoService.placeBet(req.user.id, dto);
  }

  // 🔹 Get result
  @Get('result')
  getResult() {
    return this.wingoService.getResult();
  }
}
