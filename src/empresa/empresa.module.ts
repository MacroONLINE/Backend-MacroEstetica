import { Module } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MinisiteService } from './minisite.service';
import { MinisiteController } from './minisite.controller';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule, 
  ],
  controllers: [EmpresaController, MinisiteController],
  providers: [EmpresaService, MinisiteService],
  exports: [EmpresaService],
})
export class EmpresaModule {}
