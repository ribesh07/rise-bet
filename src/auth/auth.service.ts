import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    const matched = await bcrypt.compare(pass, user.password);
    if (matched) {
      const { password, ...rest } = user as any;
      return rest;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      success: true,
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(email: string, password: string, name?: string) {
    const existing = await this.userService.findByEmail(email);
    if (existing) return {
      success: false,
      message : 'User already exists',
      data: existing,
    };
    const user = await this.userService.create(email, password);
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        access_token : this.jwtService.sign({ sub: user.id, email: user.email }),
      },
    };
  }
}
