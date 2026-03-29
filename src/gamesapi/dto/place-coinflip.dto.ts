// place-coinflip.dto.ts
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { Currency, CoinSide } from '@prisma/client';

export class PlaceCoinflipBetDto {
  @IsEnum(CoinSide)
  choice: CoinSide;

  @IsNumber()
  @Min(0.01)
  amount: number;

 @IsString()
  currency: Currency;
}
