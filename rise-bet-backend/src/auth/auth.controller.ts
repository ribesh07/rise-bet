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
    return this.authService.signup(dto);
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
    console.log(user)
    if (!user) {
      return { statusCode: 401, success : false, message: 'Invalid credentials' };
    }
    console.log('Admin user validated:', user);
    return this.authService.adminLogin(user);
  }



  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    if (!email) {
      return {
        statusCode: 400,
        success: false,
        message: 'Email is required',
      };
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await this.mailService.sendOtp(email, otp);
    } catch (err) {
      return {
        statusCode: 500,
        success: false,
        message:
          'Failed to deliver OTP email. Please check your address or try again.',
      };
    }

    return {
      success: true,
      message: 'OTP sent to your email address. Please check your inbox.',
      expiresInSeconds: 600,
    };
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
