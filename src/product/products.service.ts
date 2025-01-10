import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId },
      include: {
        presentations: true,
      },
    });
  }

  async findByCategory(companyId: string, categoryId: number) {
    return this.prisma.product.findMany({
      where: {
        companyId,
        categoryId: Number(categoryId), // Asegúrate de que sea un número
      },
      include: {
        presentations: true,
      },
    });
  }
  

  async findFeaturedByCompany(companyId: string) {
    return this.prisma.product.findMany({
      where: {
        companyId,
        isFeatured: true,
      },
      include: {
        presentations: true,
      },
    });
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        presentations: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto,
      include: {
        presentations: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async remove(id: string) {
    const product = await this.prisma.product.delete({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return { message: 'Producto eliminado correctamente' };
  }
}
