import { IsString, IsNumber, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreatePromoDto {
  @IsString()
  code: string;

  @IsNumber()
  amount: number;

  @IsInt()
  maxClaims: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
