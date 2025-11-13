import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../modules/user/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MailService } from 'src/mail/mail.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService , private readonly mailService: MailService) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto.email, dto.password , dto.username , dto.dob , dto.phone , dto.referral);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser( dto.password , dto.email, dto.username);
    if (!user) {
      return { statusCode: 401, success : false, message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }
  @Post('admin-login')
  async adminLogin(@Body() dto: LoginDto) {
    const user = await this.authService.validateAdmin( dto.password , dto.email, dto.username);
    if (!user) {
      return { statusCode: 401, success : false, message: 'Invalid credentials' };
    }
    return this.authService.adminLogin(user);
  }



  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // send email
    await this.mailService.sendOtp(email, otp);

    return { message: 'OTP sent', otp }; // you can omit OTP in response for security
  }

  @Get('test')
  getTest() {
    return { success : true , message: 'This is a protected route' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
