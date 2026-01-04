import { Controller, Post, Body, UseGuards, Req, Get, Query, Param, Put, Delete, Patch, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import { ControlService } from './control.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UpdateControlDto } from './dto/update-control.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RouletteService } from 'src/roulette/roulette.service';
import { CreatePromoDto } from '../user/dto/create-promo.dto';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/create-promotion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UPLOAD_BASE_PATH } from 'src/main';
import { CreateBlogsDto, UpdateBlogsDto } from './dto/create-blog.dto';

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
  @Get('logs')
  async getLogs(@Query('limit') limit?: string) {
    const l = limit ? Math.min(parseInt(limit, 10), 500) : 50;
    return this.controlService.getLogs(l);
  }

  @Post('create-promo')
  async createPromo(@Body() dto: CreatePromoDto) {
    return this.controlService.createPromo(dto);
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

  @Get('categories')
  async getCategories( ){
    return this.controlService.getCategories();
  }

  @UseGuards(JwtAuthGuard,AdminGuard)
  @Delete('categories')
  async deleteCategory( 
    @Query('name') name : string
  ){
    return this.controlService.deleteCategory(name);
  }

  // Promotions 

 @UseGuards(JwtAuthGuard, AdminGuard)
@Post('promotions/create')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = `${UPLOAD_BASE_PATH}/promotions`;
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const name = file.originalname.replace(/\.[^/.]+$/, '');
        const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
        const timestamp = Date.now();
        const ext = extname(file.originalname);

        cb(null, `${safeName}-${timestamp}${ext}`);
      },
    }),
  }),
)
async createPromotion(
  @Body() dto: CreatePromotionDto,
  @UploadedFile() file: Express.Multer.File,
) {
  if (!file) {
    throw new BadRequestException('Image is required');
  }
  const Img = `/uploads/promotions/${file.filename}`

  return this.controlService.createPromotion(
  dto,
    Img
  );
}


  @Get("promotions")
  findAllPromotion(@Query('group') group?: string) {
    return this.controlService.findAllPromotion(group);
  }

  @Get('promotions/:id')
  findOnePromotion(@Param('id') id: string) {
    return this.controlService.findOnePromotion(+id);
  }

@UseGuards(JwtAuthGuard, AdminGuard)
@Patch('promotions/:id')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: (req, file, cb) => {
         const uploadPath = `${UPLOAD_BASE_PATH}/promotions`;
        cb(null,uploadPath);
      },
       filename: (req, file, cb) => {
        const name = file.originalname.replace(/\.[^/.]+$/, '');
        const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
        const timestamp = Date.now();
        const ext = extname(file.originalname);

        cb(null, `${safeName}-${timestamp}${ext}`);
      },
    }),
  }),
)
async updatePromotion(
  @Param('id') id: string,
  @Body() dto: UpdatePromotionDto,
  @UploadedFile() file?: Express.Multer.File,
) {
  return this.controlService.updatePromotion(+id, dto, file);
}


  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('promotions/:id')
  removePromotion(@Param('id') id: string) {
    return this.controlService.deletePromotion(+id);
  }

  //Blogs


 @UseGuards(JwtAuthGuard, AdminGuard)
@Post('Blogs/create')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = `${UPLOAD_BASE_PATH}/blogs`;
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const name = file.originalname.replace(/\.[^/.]+$/, '');
        const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
        const timestamp = Date.now();
        const ext = extname(file.originalname);

        cb(null, `${safeName}-${timestamp}${ext}`);
      },
    }),
  }),
)
async createBlogs(
  @Body() dto: CreateBlogsDto,
  @UploadedFile() file: Express.Multer.File,
) {
  if (!file) {
    throw new BadRequestException('Image is required');
  }
  const Img = `/uploads/blogs/${file.filename}`

  return this.controlService.createBlogs(
  dto,
    Img
  );
}


  @Get("Blogs")
  findAllBlogs(@Query('group') group?: string) {
    return this.controlService.findAllBlogs(group);
  }

  @Get('Blogs/:id')
  findOneBlogs(@Param('id') id: string) {
    return this.controlService.findOneBlogs(+id);
  }

@UseGuards(JwtAuthGuard, AdminGuard)
@Patch('Blogs/:id')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: (req, file, cb) => {
         const uploadPath = `${UPLOAD_BASE_PATH}/Blogss`;
        cb(null,uploadPath);
      },
       filename: (req, file, cb) => {
        const name = file.originalname.replace(/\.[^/.]+$/, '');
        const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
        const timestamp = Date.now();
        const ext = extname(file.originalname);

        cb(null, `${safeName}-${timestamp}${ext}`);
      },
    }),
  }),
)
async updateBlogs(
  @Param('id') id: string,
  @Body() dto: UpdateBlogsDto,
  @UploadedFile() file?: Express.Multer.File,
) {
  return this.controlService.updateBlogs(+id, dto, file);
}


  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('Blogs/:id')
  removeBlogs(@Param('id') id: string) {
    return this.controlService.deleteBlogs(+id);
  }


}
