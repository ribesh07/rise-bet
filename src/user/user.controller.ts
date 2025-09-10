import { Controller, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard) // protect this route
  @Put('update')
  async updateUser(@Request() req : any, @Body() body: { name?: string }) {
    // req.user comes from JwtStrategy.validate()
    const userId = req.user.id;

    return this.userService.update(userId, body);
  }
}
