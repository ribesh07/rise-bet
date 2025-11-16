import { Module } from '@nestjs/common';
import { RouletteService } from './roulette.service';
import { RouletteController } from './roulette.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { LiveGateway } from 'src/live/live.gateway';
import { UserService } from 'src/modules/user/user.service';

@Module({
  controllers: [RouletteController],
  providers: [RouletteService , PrismaService,LiveGateway , UserService],
  exports: [RouletteService],
})
export class RouletteModule {}
