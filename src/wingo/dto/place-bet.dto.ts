import { IsEnum, IsInt, IsNumber, IsString, Min } from 'class-validator';
import { Currency, WingoBetType, WingoDuration } from '@prisma/client';

export class PlaceWingoBetDto {
 

  @IsEnum(WingoBetType)
  betType: WingoBetType;

  @IsString()
  value: string; // "RED" | "GREEN" | "5"

  @IsString()
  currency: Currency; 

  @IsNumber()
  @Min(1)
  amount: number;

  @IsEnum(WingoDuration)
  duration : WingoDuration
}
