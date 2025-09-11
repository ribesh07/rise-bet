import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

async validateUser(pass: string, email?: string, username?: string) {
  if (!email && !username) return null;

  let user;
  if (email) {
    user = await this.userService.findByEmail(email);
  } else if (username) {
    user = await this.userService.findByUserName(username);
  }

  if (!user) return null;

  const matched = await bcrypt.compare(pass, user.password);
  if (!matched) return null;

  const { password, ...result } = user as any;
  return result;
}



  async login(user: any) {
    const payload = { sub: user.id, email: user.email , username : user.username };
    return {
      success: true,
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(email: string, password: string, username: string , dob: string , phone?: string , referral?: string) {
    const existing = await this.userService.findByEmail(email);
    const existingByUsername = username ? await this.userService.findByUserName(username) : null;
    if(existingByUsername) {
      return {
        success: false,
        message : 'Username already taken !',
      };
    }
    if (existing) {
      return {
        success: false,
        message : 'User already exists !',
      };
    }

    const user = await this.userService.create(email, password , username , dob , phone , referral);
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username : user.username,
        dob : user.dob as unknown as Date,
        phone : user.phone,
        access_token : this.jwtService.sign({ sub: user.id, email: user.email }),
      },
    };
  }
}
