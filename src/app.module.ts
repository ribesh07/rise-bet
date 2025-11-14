import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './modules/admin/admin.module';
import { ControlModule } from './modules/control/cotrol.module';
import { LiveGateway } from './live/live.gateway';
import { RouletteModule } from './roulette/roulette.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),ControlModule, UserModule, AuthModule, MailModule, AdminModule, RouletteModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, MailService, LiveGateway  ],
})
export class AppModule {}
