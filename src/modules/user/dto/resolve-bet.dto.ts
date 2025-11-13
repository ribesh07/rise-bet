import { IsEnum } from 'class-validator';

import { BetStatus } from '@prisma/client';

export class ResolveBetDto {
  @IsEnum(BetStatus)
  status: BetStatus;
}
