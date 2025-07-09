// src/product/categories/category.service.ts
import { Injectable, BadRequestException } from '@nestjs/common'
import {
  PrismaService,
} from 'src/prisma/prisma.service'
import {
  FeatureCode,
  SubscriptionType,
  Prisma,
} from '@prisma/client'
import { CreateCategoryDto } from './dto/create-category.dto'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    await this.checkQuota(data.companyId, 1)

    const created = await this.prisma.productCompanyCategory.create({
      data: {
        name: data.name,
        bannerImageUrl: data.bannerImageUrl,
        miniSiteImageUrl: data.miniSiteImageUrl,
        company: { connect: { id: data.companyId } },
      },
      include: { company: { select: { logo: true } } },
    })

    await this.prisma.companyUsage.upsert({
      where: { companyId_code: { companyId: data.companyId, code: FeatureCode.CATEGORIES_TOTAL } },
      update: { used: { increment: 1 } },
      create: { companyId: data.companyId, code: FeatureCode.CATEGORIES_TOTAL, used: 1 },
    })

    return created
  }

  async findAll() {
    return this.prisma.productCompanyCategory.findMany({
      include: { company: { select: { logo: true } } },
    })
  }

  async findOne(id: number) {
    return this.prisma.productCompanyCategory.findUnique({
      where: { id },
      include: { company: { select: { logo: true } } },
    })
  }

  async update(id: number, data: Prisma.ProductCompanyCategoryUpdateInput) {
    return this.prisma.productCompanyCategory.update({
      where: { id },
      data,
      include: { company: { select: { logo: true } } },
    })
  }

  async remove(id: number) {
    const removed = await this.prisma.productCompanyCategory.delete({
      where: { id },
      include: { company: { select: { id: true, logo: true } } },
    })

    await this.prisma.companyUsage.updateMany({
      where: { companyId: removed.company.id, code: FeatureCode.CATEGORIES_TOTAL },
      data: { used: { decrement: 1 } },
    })

    return removed
  }

  async findAllByEmpresa(empresaId: string) {
    return this.prisma.productCompanyCategory.findMany({
      where: { companyId: empresaId },
      include: {
        products: true,
        company: { select: { logo: true } },
      },
    })
  }

  async findCategoriesByEmpresa(empresaId: string) {
    return this.prisma.productCompanyCategory.findMany({
      where: { companyId: empresaId },
      select: {
        id: true,
        name: true,
        bannerImageUrl: true,
        miniSiteImageUrl: true,
      },
    })
  }

  private async plan(companyId: string): Promise<SubscriptionType> {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: companyId },
      select: { subscription: true },
    })
    if (!empresa?.subscription) throw new BadRequestException('Empresa sin plan')
    return empresa.subscription
  }

  private async checkQuota(companyId: string, increment = 1) {
    const feature = await this.prisma.planFeature.findUnique({
      where: {
        plan_code: {
          plan: await this.plan(companyId),
          code: FeatureCode.CATEGORIES_TOTAL,
        },
      },
    })
    if (!feature || feature.limit === null) return

    const usage = await this.prisma.companyUsage.findUnique({
      where: { companyId_code: { companyId, code: FeatureCode.CATEGORIES_TOTAL } },
    })

    if ((usage?.used ?? 0) + increment > feature.limit) {
      throw new BadRequestException('Límite de categorías excedido')
    }
  }
}
