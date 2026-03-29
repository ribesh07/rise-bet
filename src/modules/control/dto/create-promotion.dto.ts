import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsEnum(['casino', 'sport', 'community', 'poker'])
  group: 'casino' | 'sport' | 'community' | 'poker';

  @IsDateString()
  endsAt: string;
}


export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {}
