import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('api/v1/auth')
export class AuthController {
constructor(private authService: AuthService) {}


@Post('signup')
async signup(@Body() dto: CreateUserDto) {
return this.authService.signup(dto.email, dto.password);
}


@Post('login')
async login(@Body() dto: LoginDto) {
const user = await this.authService.validateUser(dto.email, dto.password);
if (!user) {
return { statusCode: 401, message: 'Invalid credentials' };
}
return this.authService.login(user);
}


@UseGuards(JwtAuthGuard)
@Get('me')
getProfile(@Request() req : any) {
return req.user;
}
}