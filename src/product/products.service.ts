// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { ReactionType, Product } from '@prisma/client'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloud: CloudinaryService,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data: dto })
  }

  async findAll(companyId: string, userId?: string) {
    const products = await this.prisma.product.findMany({ where: { companyId } })
    if (!userId) return products
    const liked = await this.getLikedProductIds(userId)
    return products.map(p => ({ ...p, liked: liked.includes(p.id) }))
  }

  async findByCategory(companyId: string, categoryId: number, userId?: string) {
    const products = await this.prisma.product.findMany({
      where: { companyId, categoryId },
    })
    if (!userId) return products
    const liked = await this.getLikedProductIds(userId)
    return products.map(p => ({ ...p, liked: liked.includes(p.id) }))
  }

  async findFeaturedByCompany(companyId: string, userId?: string) {
    const products = await this.prisma.product.findMany({
      where: { companyId, isFeatured: true },
    })
    if (!userId) return products
    const liked = await this.getLikedProductIds(userId)
    return products.map(p => ({ ...p, liked: liked.includes(p.id) }))
  }

  async findHighlightedByCompany(companyId: string, userId?: string) {
    const rows = await this.prisma.minisiteHighlightProduct.findMany({
      where: { minisite: { empresaId: companyId } },
      select: { productId: true },
    })
    const ids = rows.map(r => r.productId)
    const products = await this.prisma.product.findMany({ where: { id: { in: ids } } })
    if (!userId) return products
    const liked = await this.getLikedProductIds(userId)
    return products.map(p => ({ ...p, liked: liked.includes(p.id) }))
  }

  async findOfferByCompany(companyId: string, userId?: string) {
    const rows = await this.prisma.minisiteProductOffer.findMany({
      where: { minisite: { empresaId: companyId } },
      select: { productId: true },
    })
    const ids = rows.map(r => r.productId)
    const products = await this.prisma.product.findMany({ where: { id: { in: ids } } })
    if (!userId) return products
    const liked = await this.getLikedProductIds(userId)
    return products.map(p => ({ ...p, liked: liked.includes(p.id) }))
  }

  async findNormalByCompany(companyId: string, userId?: string) {
    const featuredIds = (
      await this.prisma.product.findMany({
        where: { companyId, isFeatured: true },
        select: { id: true },
      })
    ).map(p => p.id)

    const highlightedIds = (
      await this.prisma.minisiteHighlightProduct.findMany({
        where: { minisite: { empresaId: companyId } },
        select: { productId: true },
      })
    ).map(r => r.productId)

    const offerIds = (
      await this.prisma.minisiteProductOffer.findMany({
        where: { minisite: { empresaId: companyId } },
        select: { productId: true },
      })
    ).map(r => r.productId)

    const exclude = [...featuredIds, ...highlightedIds, ...offerIds]

    const products = await this.prisma.product.findMany({
      where: { companyId, id: { notIn: exclude } },
    })
    if (!userId) return products
    const liked = await this.getLikedProductIds(userId)
    return products.map(p => ({ ...p, liked: liked.includes(p.id) }))
  }

  async findAllGroupedByType(companyId: string, userId?: string) {
    const featured = await this.findFeaturedByCompany(companyId, userId)
    const highlighted = await this.findHighlightedByCompany(companyId, userId)
    const offer = await this.findOfferByCompany(companyId, userId)
    const normal = await this.findNormalByCompany(companyId, userId)
    return { FEATURED: featured, HIGHLIGHT: highlighted, OFFER: offer, NORMAL: normal }
  }

  async findById(id: string, userId?: string) {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`)
    if (!userId) return product
    const reaction = await this.prisma.productReaction.findUnique({
      where: { userId_productId: { userId, productId: id } },
    })
    return { ...product, liked: reaction?.type === ReactionType.LIKE }
  }

  async updateWithImages(
    id: string,
    body: Record<string, string>,
    files: Express.Multer.File[],
  ): Promise<Product> {
    const current = await this.prisma.product.findUnique({ where: { id } })
    if (!current) throw new NotFoundException(`Producto con ID ${id} no encontrado`)

    let mainUrl = current.imageMain ?? ''
    const mainFile = files.find(f => f.fieldname === 'main')
    if (mainFile) {
      mainUrl = (await this.cloud.uploadImage(mainFile)).secure_url
    } else if (body.imageMain?.trim()) {
      mainUrl = body.imageMain.trim()
    }

    const uploadedGallery: Record<number, string> = {}
    for (const f of files) {
      const m = /^gallery_(\d+)$/.exec(f.fieldname)
      if (m) uploadedGallery[+m[1]] = (await this.cloud.uploadImage(f)).secure_url
    }

    const textGallery: Record<number, string> = {}
    Object.keys(body).forEach(k => {
      const m = /^gallery_(\d+)$/.exec(k)
      if (m && body[k]?.trim()) textGallery[+m[1]] = body[k].trim()
    })

    const maxIdx = Math.max(
      current.imageGallery.length - 1,
      ...Object.keys(uploadedGallery).map(Number),
      ...Object.keys(textGallery).map(Number),
      0,
    )

    const finalGallery: string[] = []
    for (let i = 0; i <= maxIdx; i++) {
      finalGallery[i] =
        uploadedGallery[i] ?? textGallery[i] ?? current.imageGallery[i] ?? ''
    }

    const jArr = (v?: string) =>
      v ? (JSON.parse(v) as unknown[]).map(String) : undefined
    const jBool = (v?: string) =>
      v === undefined ? undefined : v === 'true' || v === '1'

    const data: Prisma.ProductUpdateInput = {
      name: body.name ?? undefined,
      description: body.description ?? undefined,
      lab: body.lab ?? undefined,
      activeIngredients: jArr(body.activeIngredients),
      features: jArr(body.features),
      benefits: jArr(body.benefits),
      problemAddressed: body.problemAddressed ?? undefined,
      imageMain: mainUrl,
      imageGallery: finalGallery,
      isFeatured: jBool(body.isFeatured),
      isBestSeller: jBool(body.isBestSeller),
      isOnSale: jBool(body.isOnSale),
      category: body.categoryId
        ? { connect: { id: Number(body.categoryId) } }
        : undefined,
      company: body.companyId
        ? { connect: { id: body.companyId } }
        : undefined,
    }

    return this.prisma.product.update({ where: { id }, data })
  }

  async remove(id: string) {
    const deleted = await this.prisma.product.delete({ where: { id } })
    if (!deleted) throw new NotFoundException(`Producto con ID ${id} no encontrado`)
    return { message: 'Producto eliminado correctamente' }
  }

  async toggleProductReaction(
    userId: string,
    productId: string,
    type: ReactionType = ReactionType.LIKE,
  ) {
    const existing = await this.prisma.productReaction.findUnique({
      where: { userId_productId: { userId, productId } },
    })
    if (existing) {
      if (existing.type === type) {
        await this.prisma.productReaction.delete({ where: { id: existing.id } })
        return { userId, productId, reacted: false }
      }
      await this.prisma.productReaction.update({
        where: { id: existing.id },
        data: { type },
      })
      return { userId, productId, reacted: true, type }
    }
    await this.prisma.productReaction.create({
      data: { userId, productId, type },
    })
    return { userId, productId, reacted: true, type }
  }

  async getLikedProducts(userId: string) {
    const liked = await this.prisma.product.findMany({
      where: { reactions: { some: { userId, type: ReactionType.LIKE } } },
    })
    return liked.map(p => ({ ...p, liked: true }))
  }

  private async getLikedProductIds(userId: string): Promise<string[]> {
    const reactions = await this.prisma.productReaction.findMany({
      where: { userId, type: ReactionType.LIKE },
      select: { productId: true },
    })
    return reactions.map(r => r.productId)
  }
}
