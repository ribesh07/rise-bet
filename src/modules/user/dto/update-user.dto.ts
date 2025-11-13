import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsNotEmpty()
    username?: string;

    @IsOptional()
    @IsNotEmpty()
    phone?: string;

    @IsOptional()
    @IsNotEmpty()
    balance?: number;
}
