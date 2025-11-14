import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  name?: string;

  @IsNotEmpty()
  username: string;

  @IsOptional()
  phone?: string;

  @IsNotEmpty()
  dob: string;

  @IsOptional()
  referral?: string;
}
