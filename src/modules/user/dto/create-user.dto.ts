import { UserRole } from '@prisma/client';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  password: string;

  @IsOptional()
  name?: string;

  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsOptional()
  phone?: string;

  @IsNotEmpty({ message: 'Date of Birth is required' })
  dob: string;

  @IsOptional()
  referral?: string;

@IsEnum(UserRole)
@IsOptional()
role?: UserRole;
}
