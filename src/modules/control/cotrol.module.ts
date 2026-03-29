import { Module } from '@nestjs/common';
import { ControlController } from './control.controller';
import { ControlService } from './control.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RouletteModule } from 'src/roulette/roulette.module';
// import { LiveGateway } from 'src/live/live.gateway';
import { UserService } from '../user/user.service';
import { AdminService } from '../admin/admin.service';

@Module({
  imports: [RouletteModule],
  controllers: [ControlController],
  providers: [ControlService , PrismaService,UserService , AdminService],
})
export class ControlModule {}
