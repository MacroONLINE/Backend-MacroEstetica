import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryModule } from './category/category.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
  imports: [CategoryModule],
})
export class ProductModule {}
