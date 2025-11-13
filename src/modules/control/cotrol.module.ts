import { Module } from '@nestjs/common';
import { ControlController } from './control.controller';
import { ControlService } from './control.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({

  controllers: [ControlController],
  providers: [ControlService , PrismaService],
})
export class ControlModule {}
