import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateBlogsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  group: string;

  @IsDateString()
  publishedAt: string;
}


import { PartialType } from '@nestjs/mapped-types';

export class UpdateBlogsDto extends PartialType(CreateBlogsDto) {}