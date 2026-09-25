import { Currency } from '@prisma/client';
import { IsNumber, IsString, isString, Min } from 'class-validator';

export class PlacePumpBetDto {
      @IsNumber()
      @Min(0.01)
  amount: number;

  @IsString()
  currency: Currency;

  @IsString()
  difficulty: 'Easy' | 'Medium' | 'Hard';
}
