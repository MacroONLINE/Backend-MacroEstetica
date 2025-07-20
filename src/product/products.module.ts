// src/products/product.module.ts
import { Module } from '@nestjs/common'
import { ProductController } from './products.controller'
import { ProductService } from './products.service'
import { PrismaService } from '../prisma/prisma.service'
import { CategoryModule } from './category/category.module'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'  //  <-- importamos el módulo

@Module({
  imports: [CategoryModule, CloudinaryModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
