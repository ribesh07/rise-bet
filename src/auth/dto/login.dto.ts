import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf(o => !o.username) // only validate if username is not given
  @IsEmail()
  email?: string;

  @ValidateIf(o => !o.email) // only validate if email is not given
  @IsString()
  username?: string;

  @IsString()
  password: string;
}
