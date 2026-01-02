// src/modules/control/control.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateControlDto } from './dto/update-control.dto';
import { text } from 'stream/consumers';
import { error } from 'console';

@Injectable()
export class ControlService {
  constructor(private prisma: PrismaService) {}

  async updateControl(dto: UpdateControlDto, adminId: number) {
    try {
      // If you have a single config row, target it by id or use upsert
      // Example: upsert a singleton config with id = 1
      const updateControlPromise = this.prisma.betControl.upsert({
        where: { id: 2 },
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

  // Admin create promo
    async createPromo(dto: any) {
    return this.prisma.promo.create({
      data: {
        code: dto.code.toUpperCase(),
        amount: dto.amount,
        maxClaims: dto.maxClaims,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });
  }

  //getCategories
  async getCategories(){
    const categories = await this.prisma.categories.findMany({
      select : {
        name : true
      }
    });
    return {
      success : true ,
       categories: categories.map(c => c.name),
    }
  }

  async deleteCategory(name: string) {
    const deletedData =  this.prisma.categories.delete({
    where: { name },
  });
    if(!deletedData)
      throw Error (" Not Deleted !")

    return {
      success : true ,
      message : " Deleted SuccessFully !"
    }
}


}