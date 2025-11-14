import { Controller, Post, Body, UseGuards, Req, Get, Query, Param } from '@nestjs/common';
import type { Request } from 'express';
import { ControlService } from './control.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UpdateControlDto } from './dto/update-control.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RouletteService } from 'src/roulette/roulette.service';

@Controller('api/v1/admin/control')
export class ControlController {
  constructor(private readonly controlService: ControlService,private readonly rouletteService: RouletteService) {}

  @UseGuards(JwtAuthGuard,AdminGuard)
  @Post('force-spin/:tableId')
  async forceSpin(@Param('tableId') tableId: string) {
    const result = await this.rouletteService.forceSpin(tableId);
    return {
      success: true,
      triggeredBy: "ADMIN",
      result,
    };
  }
  
  @UseGuards(JwtAuthGuard,AdminGuard)
  @Post('update')
  async updateControl(@Body() body: UpdateControlDto, @Req() req: Request) {
    const adminUser = req.user as any;
    console.log('Admin user from token:', adminUser);
    const adminId = adminUser?.id;
    console.log('Admin ID from token:', adminId);
    return this.controlService.updateControl(body, adminId);
  }



  @UseGuards(JwtAuthGuard,AdminGuard)
  @Get('logs')
  async getLogs(@Query('limit') limit?: string) {
    const l = limit ? Math.min(parseInt(limit, 10), 500) : 50;
    return this.controlService.getLogs(l);
  }
}
