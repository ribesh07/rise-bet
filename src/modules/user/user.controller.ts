import { Controller, Put, Body, UseGuards, Request, Post , Get, Param, Req, UploadedFile, UseInterceptors, BadRequestException, UploadedFiles} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../..//auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionDto } from './dto/transaction.dto';
import { BetDto } from './dto/bet.dto';
import { ResolveBetDto } from './dto/resolve-bet.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { CreatePromoDto } from './dto/create-promo.dto';
import { RedeemPromoDto } from './dto/redeem-promo.dto';
import { mkdirSync } from 'fs';
import { AuthRequest } from 'src/types/auth-request';
import * as fs from 'fs';
import * as path from 'path';



@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard) // protect this route
  @Post('update')
  async updateUser(@Request() req : any, @Body() body: UpdateUserDto) {
    // req.user comes from JwtStrategy.validate()
    const userId = req.user.id;

    return this.userService.update(userId, body);
  }

@UseGuards(JwtAuthGuard)
@Post('update-password')
async updatePassword(
  @Request() req: any,
  @Body() body: { oldPassword: string; newPassword: string }
) {
  const userId = req.user.id;
  return this.userService.updatePassword(userId, body.oldPassword, body.newPassword);
}


  @UseGuards(JwtAuthGuard)
  @Get(':id/details')
  async getUserDetails(@Param('id') id: string) {
    return this.userService.getUserWithDetails(Number(id));
  }

  // Users redeem promo
  @UseGuards(JwtAuthGuard)
  @Post('redeem-promo')
  async redeem(@Req() req, @Body() dto: RedeemPromoDto) {
    return this.userService.redeemPromo(req.user.id, dto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('wallets')
  async getUserWallets(@Request() req: any) {
    const userId = req.user.id;
    return this.userService.getUserWallets(Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/transaction')
  async addTransaction(
    @Param('id') id: string,
    @Body() dto: TransactionDto,
  ) {
    return this.userService.addTransaction(Number(id), dto);
  }

  //image upload
   @Post('upload-image/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const name = file.originalname.replace(/\.[^/.]+$/, ""); 
          const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
          const timestamp = Date.now();
          const ext = extname(file.originalname);

          cb(null, `${safeName}-${timestamp}${ext}`);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() file, @Req() req ,@Param('id') id: string) {
    const userId = Number(id);
      // delete old image FIRST
    await this.userService.deleteUserImage(userId);

    // update with new image path
    return this.userService.updateUserImage(userId, file.filename);
  }

  //documets upload
//   @UseGuards(JwtAuthGuard)
// @Post("upload-user-files")
// @UseInterceptors(
//   FileFieldsInterceptor(
//     [
//       { name: "profileImage", maxCount: 1 },
//       { name: "documents", maxCount: 10 },
//     ],
//     {
//       storage: diskStorage({
//         destination: (req, file, cb) => {
//           const userId = ( req as AuthRequest).user.id;

//           let folder = 
//            file.fieldname === "profileImage"
//               ? `./uploads/users/${userId}`
//               : `./uploads/documents/${userId}`;

//           mkdirSync(folder, { recursive: true });
//           cb(null, folder);
//         },
//         filename: (req, file, cb) => {
//           const ext = extname(file.originalname);
//           const base = file.originalname.replace(ext, "").replace(/[^a-zA-Z0-9_-]/g, "");
//           const timestamp = Date.now();

//           cb(null, `${base}-${timestamp}${ext}`);
//         },
//       }),
//     }
//   )
// )
// async uploadUserFiles(
//   @UploadedFiles() files: {
//     profileImage?: Express.Multer.File[];
//     documents?: Express.Multer.File[];
//   },
//   @Request() req
// ) {
//   const userId = req.user.id;

//     const result = await this.userService.updateUserFiles(userId, files);

//   // 🔥 DELETE OLD PROFILE IMAGE SAFELY
//   if (result.oldProfile) {
//     const oldPath = path.join(process.cwd(), result.oldProfile);
//     if (fs.existsSync(oldPath)) {
//       fs.unlinkSync(oldPath);
//       console.log("Deleted old profile image:", oldPath);
//     }
//   }

//   return result;
// }

  @UseGuards(JwtAuthGuard)
  @Post('upload-user-files')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profileImage', maxCount: 1 },
        { name: 'documents', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const userId = (req as AuthRequest).user.id;

            const folder =
              file.fieldname === 'profileImage'
                ? `./uploads/users/${userId}/profile`
                : `./uploads/users/${userId}/documents`;

            try {
              mkdirSync(folder, { recursive: true });
              cb(null, folder);
            } catch (error) {
              cb(error as Error, folder);
            }
          },
          filename: (req, file, cb) => {
            const ext = extname(file.originalname);
            const base = file.originalname
              .replace(ext, '')
              .replace(/[^a-zA-Z0-9_-]/g, '_'); // Changed to underscore for safety
            const timestamp = Date.now();
            const random = Math.round(Math.random() * 1e9);

            cb(null, `${base}-${timestamp}-${random}${ext}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
          const allowedDocTypes = /pdf|doc|docx|txt/;

          const ext = extname(file.originalname).toLowerCase().slice(1);

          if (file.fieldname === 'profileImage') {
            if (allowedImageTypes.test(ext)) {
              cb(null, true);
            } else {
              cb(new Error('Only image files are allowed for profile!'), false);
            }
          } else if (file.fieldname === 'documents') {
            if (allowedDocTypes.test(ext) || allowedImageTypes.test(ext)) {
              cb(null, true);
            } else {
              cb(new Error('Invalid document type!'), false);
            }
          } else {
            cb(null, true);
          }
        },
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB
        },
      },
    ),
  )
 async uploadUserFiles(
  @UploadedFiles()
  files: {
    profileImage?: Express.Multer.File[];
    documents?: Express.Multer.File[];
  },
  @Request() req,
) {
  const userId = req.user.id;

  if (!files.profileImage && !files.documents) {
    throw new BadRequestException('No files uploaded');
  }

  try {
    const result = await this.userService.updateUserFiles(userId, files);

    // 🔥 DELETE OLD PROFILE IMAGE
    if (result.oldProfile) {
      this.deleteFileIfExists(result.oldProfile);
    }

    // 🔥 DELETE OLD DOCUMENTS - WITH TYPE ASSERTION
    if (result.oldDocuments && Array.isArray(result.oldDocuments)) {
      (result.oldDocuments as string[]).forEach((docPath) => {
        this.deleteFileIfExists(docPath);
      });
    }

    return {
      success: true,
      message: result.message,
      data: {
        profileImage: result.newProfile,
        documents: result.newDocuments,
      },
    };
  } catch (error) {
    // 🔥 ROLLBACK: Delete newly uploaded files if DB update fails
    if (files.profileImage?.[0]) {
      this.deleteFileIfExists(files.profileImage[0].path);
    }
    if (files.documents?.length) {
      files.documents.forEach((file) => {
        this.deleteFileIfExists(file.path);
      });
    }

    throw error;
  }
}

private deleteFileIfExists(filePath: string) {
  try {
    const absolutePath = filePath.startsWith('./')
      ? path.join(process.cwd(), filePath)
      : path.join(process.cwd(), filePath.replace(/^\//, ''));

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log('✅ Deleted file:', absolutePath);
    }
  } catch (error) {
    console.error('❌ Error deleting file:', filePath, error);
  }
}

}

