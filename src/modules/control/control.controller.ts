import { Controller, Post, Body, UseGuards, Req, Get, Query } from '@nestjs/common';
import type { Request } from 'express';
import { ControlService } from './control.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UpdateControlDto } from './dto/update-control.dto';

@UseGuards(AdminGuard)
@Controller('api/v1/admin/control')
export class ControlController {
  constructor(private readonly controlService: ControlService) {}

  @Post('update')
  async updateControl(@Body() body: UpdateControlDto, @Req() req: Request) {
    const adminUser = req.user as any;
    const adminId = adminUser?.id;
    return this.controlService.updateControl(body, adminId);
  }

  @Get('logs')
  async getLogs(@Query('limit') limit?: string) {
    const l = limit ? Math.min(parseInt(limit, 10), 500) : 50;
    return this.controlService.getLogs(l);
  }
}
