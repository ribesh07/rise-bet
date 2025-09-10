import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {
constructor(private prisma: PrismaService) {}


// async create(email: string, password: string, name?: string) {
// const hashed = await bcrypt.hash(password, 10);
// return this.prisma.user.create({ data: { email, password: hashed, name } });
// }

async create(email: string, password: string) {
  // hash
const hashed = await bcrypt.hash(password, 10);
  return this.prisma.user.create({
    data: {
      email,
      password: hashed,
    },
  });
}

async update(id: number, data: UpdateUserDto)  {

   const updateData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  );


  const updatedUser = await this.prisma.user.update({
    where: { id },
    data : updateData,
  });

  const { password, ...rest } = updatedUser as any;
   return {
    success: true,
    message: 'User updated successfully',
    data: rest,
  };
}


async findByEmail(email: string) {
return this.prisma.user.findUnique({ where: { email } });
}


async findById(id: number) {
return this.prisma.user.findUnique({ where: { id } });
}
}