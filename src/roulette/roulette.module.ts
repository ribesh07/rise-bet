import { Module } from '@nestjs/common';
import { RouletteService } from './roulette.service';
import { RouletteController } from './roulette.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { LiveGateway } from 'src/live/live.gateway';
import { UserService } from 'src/modules/user/user.service';
import { AdminService } from 'src/modules/admin/admin.service';

@Module({
  controllers: [RouletteController],
  providers: [RouletteService , PrismaService ,LiveGateway, UserService,AdminService],
  exports: [RouletteService],
})
export class RouletteModule {}
