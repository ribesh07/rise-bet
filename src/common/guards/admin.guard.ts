import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    // console.log('AdminGuard - User:', user);

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // If you used enum Role { USER, ADMIN } set role to 'ADMIN' or adjust if you use 'admin'
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access restricted to admin only');
    }

    return true;
  }
//   canActivate(ctx: ExecutionContext): boolean {
//   const req = ctx.switchToHttp().getRequest();
//   const user = req.user;

//   if (!user) throw new UnauthorizedException();

//   if (!user.isAdmin) {
//     throw new ForbiddenException("Admins only");
//   }

//   return true;
// }

}
