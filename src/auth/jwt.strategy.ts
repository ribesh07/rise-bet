import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private userService: UserService,
    private adminService: UserService, 
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  // async validate(payload: any) {
  //   // payload.sub contains user id
  //   const user = await this.userService.findById(payload.sub);
    
  //   if (!user) return null;

  //   const { password, ...rest } = user as any;
  //   return rest;
  // }
  
  // jwt.strategy.ts

async validate(payload: any) {
  // --- CASE 1: ADMIN AUTH ---
  if (payload.role === 'ADMIN' || payload.role === 'SUPER_ADMIN') {
    const admin = await this.adminService.findById(payload.sub);

    if (!admin) return null;

    const { password, ...rest } = admin as any;
    return { ...rest, isAdmin: true };
  }

  // --- CASE 2: USER AUTH ---
  if (payload.role === 'USER') {
    const user = await this.userService.findById(payload.sub);

    if (!user) return null;

    const { password, ...rest } = user as any;
    return { ...rest, isAdmin: false };
  }

  // No matching role
  return null;
}


}
