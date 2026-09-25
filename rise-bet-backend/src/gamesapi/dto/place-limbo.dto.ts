// dto/place-limbo-bet.dto.ts
import { IsNumber, IsString, Min } from 'class-validator';
import { Currency } from '@prisma/client';

export class PlaceLimboBetDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsNumber()
  @Min(1.01)
  targetMultiplier: number;

  @IsString()
  currency: Currency; 
}
