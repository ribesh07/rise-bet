import { IsNotEmpty, IsString } from 'class-validator';

export class RedeemPromoDto {
  @IsString()
  @IsNotEmpty({ message: 'Promo code is required' })
  code: string;
}
