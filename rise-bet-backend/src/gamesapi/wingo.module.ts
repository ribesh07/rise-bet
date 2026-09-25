import { Module } from '@nestjs/common';
import { WingoService } from './wingo.service';
import { WingoController } from './wingo.controller';
import { LiveGateway } from 'src/live/live.gateway';
import { AdminService } from 'src/modules/admin/admin.service';
import { UserService } from 'src/modules/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WingoCron } from './wingo.cron';

@Module({
  controllers: [WingoController],
  providers: [WingoService, PrismaService ,WingoCron, UserService,AdminService],
  exports: [WingoService]
})
export class WingoModule {}
