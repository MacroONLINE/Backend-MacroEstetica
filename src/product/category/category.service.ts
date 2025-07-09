// src/product/categories/category.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Prisma, SubscriptionType, FeatureCode } from '@prisma/client'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    await this.checkQuota(data.companyId, FeatureCode.CATEGORIES_TOTAL, 1)
    const created = await this.prisma.productCompanyCategory.create({
      data: {
        name: data.name,
        bannerImageUrl: data.bannerImageUrl,
        miniSiteImageUrl: data.miniSiteImageUrl,
        company: { connect: { id: data.companyId } },
      },
      include: {
        company: { select: { logo: true } },
      },
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
      include: {
        company: { select: { logo: true } },
      },
    })
  }

  async findOne(id: number) {
    const category = await this.prisma.productCompanyCategory.findUnique({
      where: { id },
      include: {
        company: { select: { logo: true } },
      },
    })
    if (!category) throw new NotFoundException('Category not found')
    return category
  }

  async update(id: number, data: Prisma.ProductCompanyCategoryUpdateInput) {
    await this.prisma.productCompanyCategory.findUniqueOrThrow({ where: { id } })
    return this.prisma.productCompanyCategory.update({
      where: { id },
      data,
      include: {
        company: { select: { logo: true } },
      },
    })
  }

  async remove(id: number) {
    const category = await this.prisma.productCompanyCategory.findUniqueOrThrow({
      where: { id },
      include: { company: { select: { logo: true } } },
    })
    await this.prisma.productCompanyCategory.delete({ where: { id } })
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
      select: {
        id: true,
        name: true,
        bannerImageUrl: true,
        miniSiteImageUrl: true,
      },
    })
  }

  private async plan(empresaId: string): Promise<SubscriptionType> {
    const e = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      select: { subscription: true },
    })
    if (!e?.subscription) throw new BadRequestException('Empresa without subscription')
    return e.subscription
  }

  private async checkQuota(
    empresaId: string,
    code: FeatureCode,
    increment = 1,
  ) {
    const plan = await this.plan(empresaId)
    const feature = await this.prisma.planFeature.findUnique({
      where: { plan_code: { plan, code } },
    })
    if (!feature || feature.limit === null) return
    const usage = await this.prisma.companyUsage.findUnique({
      where: { companyId_code: { companyId: empresaId, code } },
    })
    if ((usage?.used ?? 0) + increment > feature.limit) {
      throw new BadRequestException(`Quota for ${code} exceeded`)
    }
  }
}
