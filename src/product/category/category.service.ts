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
    console.log('[CategoryService.create] dto:', dto)

    console.log('[CategoryService.create] incoming files:', {
      hasBanner: !!banner,
      bannerField: banner?.fieldname,
      bannerOriginal: banner?.originalname,
      bannerMimetype: banner?.mimetype,
      bannerSize: banner?.size,
      bannerBufferLen: (banner as any)?.buffer?.length,
      hasMinisite: !!minisite,
      minisiteField: minisite?.fieldname,
      minisiteOriginal: minisite?.originalname,
      minisiteMimetype: minisite?.mimetype,
      minisiteSize: minisite?.size,
      minisiteBufferLen: (minisite as any)?.buffer?.length,
    })

    if (!dto.name || !dto.companyId) {
      console.warn('[CategoryService.create] missing required fields (name/companyId)')
      throw new BadRequestException('name y companyId son obligatorios')
    }

    const existing = await this.prisma.productCompanyCategory.findUnique({
      where: { name_companyId: { name: dto.name, companyId: dto.companyId } },
      include: { company: { select: { logo: true } } },
    })
    console.log('[CategoryService.create] existing category:', {
      found: !!existing,
      id: existing?.id,
      bannerImageUrl: existing?.bannerImageUrl,
      miniSiteImageUrl: existing?.miniSiteImageUrl,
    })

    let bannerUrl = existing?.bannerImageUrl ?? ''
    if (banner) {
      try {
        const uploaded = await this.cloud.uploadImage(banner)
        bannerUrl = uploaded.secure_url
        console.log('[CategoryService.create] banner uploaded:', {
          public_id: uploaded.public_id,
          secure_url: uploaded.secure_url,
        })
      } catch (e) {
        console.error('[CategoryService.create] banner upload error:', e)
        throw e
      }
    } else {
      console.log('[CategoryService.create] no banner file provided, using existing/fallback URL')
    }

    let minisiteUrl = existing?.miniSiteImageUrl ?? ''
    if (minisite) {
      try {
        const uploaded = await this.cloud.uploadImage(minisite)
        minisiteUrl = uploaded.secure_url
        console.log('[CategoryService.create] minisite uploaded:', {
          public_id: uploaded.public_id,
          secure_url: uploaded.secure_url,
        })
      } catch (e) {
        console.error('[CategoryService.create] minisite upload error:', e)
        throw e
      }
    } else {
      console.log('[CategoryService.create] no minisite file provided, using existing/fallback URL')
    }

    if (existing) {
      console.log('[CategoryService.create] updating existing category with new URLs')
      const updated = await this.prisma.productCompanyCategory.update({
        where: { id: existing.id },
        data: { bannerImageUrl: bannerUrl, miniSiteImageUrl: minisiteUrl },
        include: { company: { select: { logo: true } } },
      })
      console.log('[CategoryService.create] updated category id:', updated.id)
      return updated
    }

    console.log('[CategoryService.create] creating new category, checking quota...')
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
    console.log('[CategoryService.create] created category id:', created.id)

    await this.prisma.companyUsage.upsert({
      where: { companyId_code: { companyId: dto.companyId, code: FeatureCode.CATEGORIES_TOTAL } },
      update: { used: { increment: 1 } },
      create: { companyId: dto.companyId, code: FeatureCode.CATEGORIES_TOTAL, used: 1 },
    })
    console.log('[CategoryService.create] usage incremented for company:', dto.companyId)

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
    console.log('[CategoryService.update] id:', id)
    console.log('[CategoryService.update] patch keys:', Object.keys(patch as any))

    console.log('[CategoryService.update] incoming files:', {
      hasBanner: !!banner,
      bannerField: banner?.fieldname,
      bannerOriginal: banner?.originalname,
      bannerMimetype: banner?.mimetype,
      bannerSize: banner?.size,
      bannerBufferLen: (banner as any)?.buffer?.length,
      hasMinisite: !!minisite,
      minisiteField: minisite?.fieldname,
      minisiteOriginal: minisite?.originalname,
      minisiteMimetype: minisite?.mimetype,
      minisiteSize: minisite?.size,
      minisiteBufferLen: (minisite as any)?.buffer?.length,
    })

    const current = await this.prisma.productCompanyCategory.findUniqueOrThrow({ where: { id } })
    console.log('[CategoryService.update] current category:', {
      id: current.id,
      bannerImageUrl: current.bannerImageUrl,
      miniSiteImageUrl: current.miniSiteImageUrl,
    })

    let bannerUrl = current.bannerImageUrl
    if (banner) {
      try {
        const uploaded = await this.cloud.uploadImage(banner)
        bannerUrl = uploaded.secure_url
        console.log('[CategoryService.update] banner uploaded:', {
          public_id: uploaded.public_id,
          secure_url: uploaded.secure_url,
        })
      } catch (e) {
        console.error('[CategoryService.update] banner upload error:', e)
        throw e
      }
    } else {
      console.log('[CategoryService.update] no banner file provided, keeping current URL')
    }

    let minisiteUrl = current.miniSiteImageUrl
    if (minisite) {
      try {
        const uploaded = await this.cloud.uploadImage(minisite)
        minisiteUrl = uploaded.secure_url
        console.log('[CategoryService.update] minisite uploaded:', {
          public_id: uploaded.public_id,
          secure_url: uploaded.secure_url,
        })
      } catch (e) {
        console.error('[CategoryService.update] minisite upload error:', e)
        throw e
      }
    } else {
      console.log('[CategoryService.update] no minisite file provided, keeping current URL')
    }

    console.log('[CategoryService.update] final URLs to persist:', {
      bannerUrl,
      minisiteUrl,
    })

    const updated = await this.prisma.productCompanyCategory.update({
      where: { id },
      data: { ...patch, bannerImageUrl: bannerUrl, miniSiteImageUrl: minisiteUrl },
      include: { company: { select: { logo: true } } },
    })
    console.log('[CategoryService.update] updated category id:', updated.id)

    return updated
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
        products: {
          include: {
            company: true,
            category: true,
            featured: true,
            highlightProducts: true,
            offers: true,
            reactions: true,
          },
        },
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
