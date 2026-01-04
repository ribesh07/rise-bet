// src/modules/control/control.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateControlDto } from './dto/update-control.dto';
import { text } from 'stream/consumers';
import { error } from 'console';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/create-promotion.dto';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { CreateBlogsDto, UpdateBlogsDto } from './dto/create-blog.dto';

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

//Promotions 
 async createPromotion(dto: CreatePromotionDto , image : string) {
   const data = await this.prisma.promotion.create({
      data: {
        ...dto,
        image,
        endsAt: new Date(dto.endsAt),
      },
    });

    return {
      success : true ,
      data : data
    }
  }

  async findAllPromotion(baseUrl : string,group?: string) {
    const data = await this.prisma.promotion.findMany({
      where: {
        isActive: true,
        ...(group && { group: group as any }),
      },
      orderBy: { createdAt: 'desc' },
    });
    return {
      success : true ,
      data : data.map( d => ({
        ...d ,
        image : d.image ?  `https://api.playrise.vip${d.image}`: null
        // image : `${baseUrl}${d.image}`
      }))
    }
  }

 async findOnePromotion(id: number , baseUrl : string) {
   const data =  await this.prisma.promotion.findUnique({
      where: { id },
    });

    return {
      success : true ,
      data : {
        ...data ,
        image :data?.image ? `https://api.playrise.vip${data?.image}`: null
      }
    }
  }

  async updatePromotion(
  id: number,
  dto: UpdatePromotionDto,
  file?: Express.Multer.File,
) {
  const promotion = await this.prisma.promotion.findUnique({
    where: { id },
  });

  if (!promotion) {
    throw new NotFoundException('Promotion not found');
  }

  let imagePath = promotion.image;

  // 🔥 If new image uploaded → replace
  if (file) {
    imagePath = `/uploads/promotions/${file.filename}`;

    // (optional but recommended) delete old image
    if (promotion.image) {
      const oldPath = join(process.cwd(), promotion.image);
      if (existsSync(oldPath)) {
        unlinkSync(oldPath);
      }
    }
  }

  return this.prisma.promotion.update({
    where: { id },
    data: {
      ...dto,
      image: imagePath,
      ...(dto.endsAt && { endsAt: new Date(dto.endsAt) }),
    },
  });
}


  deletePromotion(id: number) {
    return this.prisma.promotion.delete({
      where: { id },
    });
  }

  // Blogs
 async createBlogs(dto: CreateBlogsDto , image : string) {
   const data = await this.prisma.blog.create({
      data: {
        ...dto,
        image,
      },
    });

    return {
      success : true ,
      data : data
    }
  }

 async findAllBlogs(group?: string) {
    const data = await this.prisma.blog.findMany({
      where: {
        isActive: true,
        ...(group && { group: group as any }),
      },
      orderBy: { createdAt: 'desc' },
    });

       return {
      success : true ,
      data : data.map( d => ({
        ...d ,
        image : d.image ? `https://api.playrise.vip${d.image}` : null
        // image : `${baseUrl}${d.image}`
      }))
    }
  }

async findOneBlogs(id: number) {
   const data = await this.prisma.blog.findUnique({
      where: { id },
    });
    return {
      success : true ,
      data : {
        ...data ,
        image : data?.image ?  `https://api.playrise.vip${data.image}` : null
      }
    }
  }

  async updateBlogs(
  id: number,
  dto: UpdateBlogsDto,
  file?: Express.Multer.File,
) {
  const Blogs = await this.prisma.blog.findUnique({
    where: { id },
  });

  if (!Blogs) {
    throw new NotFoundException('Blogs not found');
  }

  let imagePath = Blogs.image;

  // 🔥 If new image uploaded → replace
  if (file) {
    imagePath = `/uploads/blogs/${file.filename}`;

    // (optional but recommended) delete old image
    if (Blogs.image) {
      const oldPath = join(process.cwd(), Blogs.image);
      if (existsSync(oldPath)) {
        unlinkSync(oldPath);
      }
    }
  }

  return this.prisma.blog.update({
    where: { id },
    data: {
      ...dto,
      image: imagePath,
    },
  });
}


 async deleteBlogs(id: number) {
   const data =  await this.prisma.blog.delete({
      where: { id },
    });
    console.log(data)
     if (data.image) {
      const oldPath = join(process.cwd(), data.image);
      if (existsSync(oldPath)) {
        unlinkSync(oldPath);
      }
    }
    return {
      success : true ,
      message : " Deleted Successfully !"
    }

  }




  //eol

}