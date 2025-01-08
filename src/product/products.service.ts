import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findByCategory(categoryId: number) {
    console.log('Buscando productos con categoryId:', categoryId);
    return this.prisma.product.findMany({
      where: { categoryId },
    });
  }
  

  async findByCompany(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId },
    });
  }

  async findFeaturedByCompany(companyId: string) {
    return this.prisma.product.findMany({
      where: {
        companyId,
        isFeatured: true,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
