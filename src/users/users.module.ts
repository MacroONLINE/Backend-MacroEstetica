import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express'; // Importa MulterModule
import * as multer from 'multer'; // Importa multer
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // Si usas Cloudinary
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    CloudinaryModule, 
  ],
  providers: [UsersService, PrismaService],
  controllers: [UsersController],
  exports: [UsersService], 
})
export class UsersModule {}
