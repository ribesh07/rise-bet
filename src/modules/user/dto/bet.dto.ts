import { IsNumber, Min } from 'class-validator';

export class BetDto {
  @IsNumber()
  matchId: number;

  @IsNumber()
  @Min(1)
  stake: number;

  @IsNumber()
  odds: number;
}
