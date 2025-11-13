import { IsEnum, IsNumber, Min } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class TransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  @Min(1)
  amount: number;
}
