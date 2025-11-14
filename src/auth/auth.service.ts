import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Decimal } from '@prisma/client/runtime/library';
import { AdminService } from 'src/modules/admin/admin.service';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
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
    const payload = { sub: user.id, email: user.email ,role :user.role, username : user.username };
    const details = await this.userService.getUserWithDetails(Number(user.id));

    const { password, ...rest } = details as any;
    console.log('User details fetched for login:', rest);
    return {
      success: true,
      message: 'Login successful',
      data: rest,
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(dto : CreateUserDto) {
    const existing = await this.userService.findByEmail(dto.email);
    const existingByUsername = dto.username ? await this.userService.findByUserName(dto.username) : null;
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

    const user = await this.userService.create(dto);
    
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

  async validateAdmin(pass: string, email?: string, username?: string) {
  if (!email ) return null;

  let admin;
  if (email) {
    admin = await this.adminService.findByEmail(email);
  } 

  if (!admin) return null;

  const matched = await bcrypt.compare(pass, admin.password);
  if (!matched) return null;

  const { password, ...result } = admin as any;
  return result;
}



  async adminLogin(user: any) {
    const payload = { sub: user.id, email: user.email, role :user.role ,username : user.username };
    const details = await this.adminService.getAdminDetails(Number(user.id));
    // console.log('Admin details fetched for login:', details);
     const { password, ...rest } = details as any;
    return {
      success: true,
      message: 'Login successful',
      data: rest,
      access_token: this.jwtService.sign(payload),
    };
  }
}
