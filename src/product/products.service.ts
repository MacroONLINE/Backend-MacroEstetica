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
      include: {
        presentations: true, // Incluir presentaciones al crear
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        presentations: true,
      },
    });
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        presentations: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async findByCategory(categoryId: number) {
    return this.prisma.product.findMany({
      where: { categoryId },
      include: {
        presentations: true,
      },
    });
  }

  async findByCompany(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId },
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        presentations: true, // Incluir presentaciones al actualizar
      },
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
      include: {
        presentations: true, // Opcional: incluir presentaciones al eliminar
      },
    });
  }
}
