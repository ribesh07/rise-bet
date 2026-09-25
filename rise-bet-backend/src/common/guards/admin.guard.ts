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

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const role = user.role;

    if (
      role !== 'ADMIN' &&
      role !== 'SUPER_ADMIN' &&
      role !== 'SUPERADMIN' &&
      role !== 'MODERATOR' &&
      role !== true &&
      user.isAdmin !== true
    ) {
      throw new ForbiddenException('Access restricted to admin only');
    }

    return true;
  }
}
