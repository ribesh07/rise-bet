import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { Currency } from '@prisma/client';

export enum RpsChoice {
  ROCK = 'rock',
  PAPER = 'paper',
  SCISSORS = 'scissors',
}

export class PlaceRpsBetDto {
  @IsEnum(RpsChoice)
  choice: RpsChoice;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  currency: Currency;
}
