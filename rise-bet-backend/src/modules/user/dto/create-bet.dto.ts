import { IsEnum, IsNumberString, IsNumber, IsObject, IsString } from 'class-validator';
import { Currency } from '@prisma/client';

export class CreateBetDto {
  @IsNumber()
  stake: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsString()
  game: string; // 'roulette'

  @IsObject()
  payload: any; // validate carefully in service based on bet type
}
