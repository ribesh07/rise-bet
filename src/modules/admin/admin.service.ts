import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  
  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  async findByEmail(email?: string ) {
    return this.prisma.admin.findUnique({ where: { email } });
  }

  async findByUserName(username: string) {
    return this.prisma.admin.findFirst({ where: { username } });
  }

   //shows all details
  async getAdminDetails(adminId: number) {
    return this.prisma.admin.findUnique({
      where: { id: adminId },
      
    });
  }


  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
