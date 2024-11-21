import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Asegúrate de ajustar la ruta según tu estructura

@Module({
  imports: [PrismaModule], 
  providers: [CoursesService],
  controllers: [CoursesController],
})
export class CoursesModule {}
