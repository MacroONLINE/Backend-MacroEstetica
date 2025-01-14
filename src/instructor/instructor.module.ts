import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [InstructorService, PrismaService],
  controllers: [InstructorController],
})
export class InstructorModule {}
