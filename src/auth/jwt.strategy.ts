import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
constructor(config: ConfigService, private userService: UserService) {
super({
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
ignoreExpiration: false,
secretOrKey: config.get<string>('JWT_SECRET'),
});
}


async validate(payload: any) {
// payload.sub contains user id
const user = await this.userService.findById(payload.sub);
if (!user) return null;
const { password, ...rest } = user as any;
return rest;
}
}