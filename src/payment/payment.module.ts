import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule } from '@nestjs/config';
import { PaymentScheduler } from './payment.scheduler';
import { PrismaModule } from '../prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CoursesModule } from '../courses/courses.module'; 

@Module({
  imports: [
    ConfigModule, 
    PrismaModule,
    CoursesModule,
    ScheduleModule.forRoot()
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentScheduler],
})
export class PaymentModule {}
