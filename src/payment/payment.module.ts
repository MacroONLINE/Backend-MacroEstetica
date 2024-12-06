import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from '../courses/courses.module'; // Asegúrate que este modulo exista y exporte CoursesService
import { PrismaModule } from '../prisma/prisma.module';     // Asegúrate que este modulo exista y exporte PrismaService

@Module({
  imports: [
    ConfigModule,
    CoursesModule,    // Importamos el modulo que provee CoursesService
    PrismaModule,     // Importamos el modulo que provee PrismaService
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
