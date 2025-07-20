// src/product/categories/category.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma, SubscriptionType, FeatureCode } from '@prisma/client'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Express } from 'express'

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloud: CloudinaryService,
  ) {}

  async create(
    dto: CreateCategoryDto,
    banner?: Express.Multer.File,
    minisite?: Express.Multer.File,
  ) {
    if (!dto.name || !dto.companyId) {
      throw new BadRequestException('name y companyId son obligatorios')
    }

    const existing = await this.prisma.productCompanyCategory.findUnique({
      where: { name_companyId: { name: dto.name, companyId: dto.companyId } },
      include: { company: { select: { logo: true } } },
    })

    const bannerUrl = banner ? (await this.cloud.uploadImage(banner)).secure_url : existing?.bannerImageUrl ?? ''
    const minisiteUrl = minisite ? (await this.cloud.uploadImage(minisite)).secure_url : existing?.miniSiteImageUrl ?? ''

    if (existing) {
      return this.prisma.productCompanyCategory.update({
        where: { id: existing.id },
        data: { bannerImageUrl: bannerUrl, miniSiteImageUrl: minisiteUrl },
        include: { company: { select: { logo: true } } },
      })
    }

    await this.checkQuota(dto.companyId, FeatureCode.CATEGORIES_TOTAL, 1)

    const created = await this.prisma.productCompanyCategory.create({
      data: {
        name: dto.name,
        bannerImageUrl: bannerUrl,
        miniSiteImageUrl: minisiteUrl,
        companyId: dto.companyId,
      },
      include: { company: { select: { logo: true } } },
    })

    await this.prisma.companyUsage.upsert({
      where: { companyId_code: { companyId: dto.companyId, code: FeatureCode.CATEGORIES_TOTAL } },
      update: { used: { increment: 1 } },
      create: { companyId: dto.companyId, code: FeatureCode.CATEGORIES_TOTAL, used: 1 },
    })

    return created
  }

  async findAll() {
    return this.prisma.productCompanyCategory.findMany({
      include: { company: { select: { logo: true } } },
    })
  }

  async findOne(id: number) {
    const cat = await this.prisma.productCompanyCategory.findUnique({
      where: { id },
      include: { company: { select: { logo: true } } },
    })
    if (!cat) throw new NotFoundException('Category not found')
    return cat
  }

  async update(
    id: number,
    patch: Prisma.ProductCompanyCategoryUpdateInput,
    banner?: Express.Multer.File,
    minisite?: Express.Multer.File,
  ) {
    const current = await this.prisma.productCompanyCategory.findUniqueOrThrow({ where: { id } })

    const bannerUrl = banner ? (await this.cloud.uploadImage(banner)).secure_url : current.bannerImageUrl
    const minisiteUrl = minisite ? (await this.cloud.uploadImage(minisite)).secure_url : current.miniSiteImageUrl

    return this.prisma.productCompanyCategory.update({
      where: { id },
      data: { ...patch, bannerImageUrl: bannerUrl, miniSiteImageUrl: minisiteUrl },
      include: { company: { select: { logo: true } } },
    })
  }

  async remove(id: number) {
    const category = await this.prisma.productCompanyCategory.findUniqueOrThrow({ where: { id } })
    await this.prisma.productCompanyCategory.delete({ where: { id } })
    await this.prisma.companyUsage.upsert({
      where: { companyId_code: { companyId: category.companyId, code: FeatureCode.CATEGORIES_TOTAL } },
      update: { used: { decrement: 1 } },
      create: { companyId: category.companyId, code: FeatureCode.CATEGORIES_TOTAL, used: 0 },
    })
    return category
  }

  async findAllByEmpresa(empresaId: string) {
    return this.prisma.productCompanyCategory.findMany({
      where: { companyId: empresaId },
      include: {
        products: { select: { id: true, name: true } },
        company: { select: { logo: true } },
      },
    })
  }

  async findCategoriesByEmpresa(empresaId: string) {
    return this.prisma.productCompanyCategory.findMany({
      where: { companyId: empresaId },
      select: { id: true, name: true, bannerImageUrl: true, miniSiteImageUrl: true },
    })
  }

  private async plan(empresaId: string): Promise<SubscriptionType> {
    const e = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      select: { subscription: true },
    })
    if (!e?.subscription) throw new BadRequestException('Empresa sin suscripción')
    return e.subscription
  }

  private async checkQuota(empresaId: string, code: FeatureCode, increment = 1) {
    const feature = await this.prisma.planFeature.findUnique({
      where: { plan_code: { plan: await this.plan(empresaId), code } },
    })
    if (!feature || feature.limit === null) return
    const usage = await this.prisma.companyUsage.findUnique({
      where: { companyId_code: { companyId: empresaId, code } },
    })
    if ((usage?.used ?? 0) + increment > feature.limit) {
      throw new BadRequestException(`Límite de ${code} excedido`)
    }
  }
}
