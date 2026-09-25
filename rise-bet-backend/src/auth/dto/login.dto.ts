import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf(o => !o.username) // only validate if username is not given
  @IsEmail()
  email?: string;

  @ValidateIf(o => !o.email) // only validate if email is not given
  @IsOptional()
  username?: string;

  @IsNotEmpty()
  password: string;
}
