// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ReactionType } from '@prisma/client'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto })
  }

  async findAll(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId },
      include: { presentations: true },
    })
  }

  async findByCategory(companyId: string, categoryId: number) {
    return this.prisma.product.findMany({
      where: { companyId, categoryId: Number(categoryId) },
      include: { presentations: true },
    })
  }

  async findFeaturedByCompany(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId, isFeatured: true },
      include: { presentations: true },
    })
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { presentations: true },
    })
    if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`)
    return product
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: { id },
      data: dto,
      include: { presentations: true },
    })
    if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`)
    return product
  }

  async remove(id: string) {
    const deleted = await this.prisma.product.delete({ where: { id } })
    if (!deleted) throw new NotFoundException(`Producto con ID ${id} no encontrado`)
    return { message: 'Producto eliminado correctamente' }
  }

  async toggleProductReaction(userId: string, productId: string, type: ReactionType = ReactionType.LIKE) {
    const existing = await this.prisma.productReaction.findUnique({
      where: { userId_productId: { userId, productId } },
    })
    if (existing) {
      if (existing.type === type) {
        await this.prisma.productReaction.delete({ where: { id: existing.id } })
        return { userId, productId, reacted: false }
      }
      await this.prisma.productReaction.update({ where: { id: existing.id }, data: { type } })
      return { userId, productId, reacted: true, type }
    }
    await this.prisma.productReaction.create({ data: { userId, productId, type } })
    return { userId, productId, reacted: true, type }
  }
}
