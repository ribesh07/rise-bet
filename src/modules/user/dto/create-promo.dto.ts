import { IsString, IsNumber, IsOptional, IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreatePromoDto {
  @IsString()
  @IsNotEmpty({ message: 'Code must not be empty' })
  code: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Amount must not be empty' })
  amount: number;

  @IsInt()
  @IsNotEmpty({ message: 'maxClaims must not be empty' })
  maxClaims: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
