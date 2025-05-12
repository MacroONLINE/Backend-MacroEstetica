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

  async findAll(companyId: string, userId?: string) {
    const products = await this.prisma.product.findMany({
      where: { companyId },
      include: { presentations: true },
    })

    if (!userId) return products

    const liked = await this.getLikedProductIds(userId)
    return products.map((p) => ({ ...p, liked: liked.includes(p.id) }))
  }

  async findByCategory(companyId: string, categoryId: number, userId?: string) {
    const products = await this.prisma.product.findMany({
      where: { companyId, categoryId },
      include: { presentations: true },
    })

    if (!userId) return products

    const liked = await this.getLikedProductIds(userId)
    return products.map((p) => ({ ...p, liked: liked.includes(p.id) }))
  }

  async findFeaturedByCompany(companyId: string, userId?: string) {
    const products = await this.prisma.product.findMany({
      where: { companyId, isFeatured: true },
      include: { presentations: true },
    })

    if (!userId) return products

    const liked = await this.getLikedProductIds(userId)
    return products.map((p) => ({ ...p, liked: liked.includes(p.id) }))
  }

  async findById(id: string, userId?: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { presentations: true },
    })
    if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`)
    if (!userId) return product
    const reaction = await this.prisma.productReaction.findUnique({
      where: { userId_productId: { userId, productId: id } },
    })
    return { ...product, liked: reaction?.type === ReactionType.LIKE }
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

  async getLikedProducts(userId: string) {
    const liked = await this.prisma.product.findMany({
      where: {
        reactions: {
          some: { userId, type: ReactionType.LIKE },
        },
      },
      include: { presentations: true },
    })
    return liked.map((p) => ({ ...p, liked: true }))
  }

  private async getLikedProductIds(userId: string): Promise<string[]> {
    const reactions = await this.prisma.productReaction.findMany({
      where: { userId, type: ReactionType.LIKE },
      select: { productId: true },
    })
    return reactions.map((r) => r.productId)
  }
}
