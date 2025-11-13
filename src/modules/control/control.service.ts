// src/modules/control/control.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateControlDto } from './dto/update-control.dto';

@Injectable()
export class ControlService {
  constructor(private prisma: PrismaService) {}

  async updateControl(dto: UpdateControlDto, adminId: number) {
    try {
      // If you have a single config row, target it by id or use upsert
      // Example: upsert a singleton config with id = 1
      const updateControlPromise = this.prisma.betControl.upsert({
        where: { id: 1 },
        update: {
          mode: dto.mode,
          forcedResult: dto.forcedResult,
          winRatio: dto.winRatio,
          targetUserId: dto.targetUserId,
          active: dto.active,
        },
        create: {
          id: 1,
          mode: dto.mode,
          forcedResult: dto.forcedResult,
          winRatio: dto.winRatio ?? 0,
          targetUserId: dto.targetUserId,
          active: dto.active ?? true,
        },
      });

      const createLogPromise = this.prisma.controlLog.create({
        data: {
          adminId,
          action: 'UPDATE_CONTROL',
          details: JSON.stringify(dto),
        },
      });

      // run both in a transaction so either both succeed or none
      const [updatedControl, log] = await this.prisma.$transaction([
        updateControlPromise,
        createLogPromise,
      ]);

      return { ok: true, control: updatedControl, log };
    } catch (err) {
      console.error('updateControl error', err);
      throw new BadRequestException('Failed to update control settings');
    }
  }

  async getLogs(limit = 50) {
    return this.prisma.controlLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { admin: { select: { id: true, email: true } } },
    });
  }
}
