// src/empresa/minisite.service.ts
import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common'
import {
  Prisma,
  FeatureCode,
  SubscriptionType,
  Product,
  Banner,
  MinisiteFeaturedProduct,
  MinisiteHighlightProduct,
  MinisiteSpeciality,
  Giro,
} from '@prisma/client'
import { UploadApiResponse } from 'cloudinary'
import { PrismaService } from '../prisma/prisma.service'
import { CloudinaryService } from '../cloudinary/cloudinary.service'

export interface UsageResponse<T = any> {
  code: FeatureCode
  limit: number | null
  used: number
  items: T[]
}

type SlideMeta = {
  title: string
  description?: string
  cta?: string
  order?: number
}

export interface BulkProductMeta {
  alias: number
  id?: string
  type?: 'NORMAL' | 'FEATURED' | 'HIGHLIGHT' | 'OFFER'
  name: string
  description: string
  categoryId?: number
  activeIngredients?: string[]
  benefits?: string[]
  features?: string[]
  isFeatured?: boolean
  presentations?: string[]
  isBestSeller?: boolean
  isOnSale?: boolean
  lab?: string
  problemAddressed?: string
  order?: number
  tagline?: string
  highlightFeatures?: string[]
  highlightDescription?: string
  title?: string
  offerDescription?: string
}

@Injectable()
export class MinisiteService {
  private readonly log = new Logger('MinisiteService')

  constructor(private readonly prisma: PrismaService, private readonly cloud: CloudinaryService) {}

  async quotas(empresaId: string): Promise<UsageResponse[]> {
    const plan = await this.plan(empresaId)
    const limits = await this.prisma.planFeature.findMany({ where: { plan } })
    const out: UsageResponse[] = []
    for (const f of limits) {
      const { items, used } = await this.collect(empresaId, f.code)
      out.push({ code: f.code, limit: f.limit, used, items })
    }
    return out
  }

  async quota(empresaId: string, code: FeatureCode): Promise<UsageResponse> {
    const plan = await this.plan(empresaId)
    const feature = await this.prisma.planFeature.findUnique({ where: { plan_code: { plan, code } } })
    if (!feature) throw new BadRequestException('Límite no definido')
    const { items, used } = await this.collect(empresaId, code)
    return { code, limit: feature.limit, used, items }
  }

  async objects(empresaId: string) {
    const plan = await this.plan(empresaId)
    const codes = await this.prisma.planFeature.findMany({ where: { plan }, select: { code: true } })
    const obj = {} as Record<FeatureCode, any[]>
    for (const { code } of codes) obj[code] = (await this.collect(empresaId, code)).items
    return obj
  }

  async objectsByCode(empresaId: string, code: FeatureCode) {
    return (await this.collect(empresaId, code)).items
  }

  async upsertProduct(
    empresaId: string,
    data: Omit<Prisma.ProductUncheckedCreateInput, 'companyId' | 'id'> &
      Partial<Prisma.ProductUncheckedUpdateInput> & { id?: string },
  ): Promise<Product> {
    await this.checkQuota(empresaId, FeatureCode.PRODUCTS_TOTAL, data.id ? 0 : 1)
    if (data.id) {
      const { id, ...upd } = data
      return this.prisma.product.update({ where: { id }, data: upd })
    }
    return this.prisma.product.create({ data: { ...data, companyId: empresaId } })
  }

  async upsertBanner(
    empresaId: string,
    data: Omit<Prisma.BannerUncheckedCreateInput, 'empresaId' | 'id'> &
      Partial<Prisma.BannerUncheckedUpdateInput> & { id?: string },
  ): Promise<Banner> {
    const existing = await this.prisma.banner.findFirst({ where: { empresaId } })
    if (!data.id && existing) throw new BadRequestException('Ya existe un banner')
    if (data.id) {
      const { id, ...upd } = data
      return this.prisma.banner.update({ where: { id }, data: upd })
    }
    return this.prisma.banner.create({ data: { ...data, empresaId } })
  }

  async upsertFeatured(
    empresaId: string,
    data: { id?: string; productId: string; order?: number; tagline?: string },
  ): Promise<MinisiteFeaturedProduct> {
    await this.checkQuota(empresaId, FeatureCode.FEATURED_PRODUCTS_TOTAL, data.id ? 0 : 1)
    const minisiteId = await this.minisite(empresaId)
    if (data.id) {
      const { id, ...upd } = data
      return this.prisma.minisiteFeaturedProduct.update({ where: { id }, data: { ...upd, minisiteId } })
    }
    return this.prisma.minisiteFeaturedProduct.create({ data: { ...data, minisiteId } })
  }

  async upsertHighlight(
    empresaId: string,
    data: {
      id?: string
      productId: string
      highlightFeatures: string[]
      highlightDescription?: string
      hoghlightImageUrl?: string
    },
  ): Promise<MinisiteHighlightProduct> {
    const minisiteId = await this.minisite(empresaId)
    if (data.id) {
      const { id, ...upd } = data
      return this.prisma.minisiteHighlightProduct.update({ where: { id }, data: { ...upd, minisiteId } })
    }
    return this.prisma.minisiteHighlightProduct.upsert({
      where: { minisiteId_productId: { minisiteId, productId: data.productId } },
      update: { ...data },
      create: { ...data, minisiteId },
    })
  }

  async getMinisiteSetup(empresaId: string) {
    const plan = await this.plan(empresaId)
    const slotLimit = await this.prisma.planFeature.findUnique({
      where: { plan_code: { plan, code: FeatureCode.BANNER_PRODUCT_SLOTS } },
      select: { limit: true },
    })
    const company = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      select: {
        name: true,
        location: true,
        title: true,
        giro: true,
        profileImage: true,
        minisite: { select: { minisiteColor: true, slogan: true } },
      },
    })
    if (!company) throw new NotFoundException('Empresa no encontrada')
    const slides = await this.prisma.minisiteSlide.findMany({
      where: { minisite: { empresaId } },
      select: { id: true, title: true, description: true, cta: true, imageSrc: true, order: true },
    })
    const banners = await this.prisma.banner.findMany({ where: { empresaId } })
    return {
      company,
      minisiteColor: company.minisite?.minisiteColor ?? null,
      slides,
      slideUsage: { used: slides.length, limit: slotLimit?.limit ?? null },
      banners,
    }
  }

  // src/empresa/minisite.service.ts
  async setupMinisite(
    empresaId: string,
    body: {
      name: string
      description: string
      giro: Giro
      slogan?: string
      slidesMeta: SlideMeta[]
      minisiteColor?: string
    },
    files: { logo?: Express.Multer.File; slides?: Express.Multer.File[] },
  ) {
    this.log.verbose(`setupMinisite → empresa=${empresaId}`)
    const metaCount = Array.isArray(body.slidesMeta) ? body.slidesMeta.length : 0
    this.log.debug(`metaCount=${metaCount}`)
  
    let logoUrl: string | undefined
    if (files.logo) {
      const res = await this.cloud.uploadImage(files.logo)
      logoUrl = res.secure_url
    }
  
    await this.prisma.empresa.update({
      where: { id: empresaId },
      data: {
        name: body.name,
        profileImage: logoUrl,
        title: body.slogan,
        location: body.description,
        giro: body.giro,
      },
    })
  
    await this.prisma.minisite.update({
      where: { empresaId },
      data: { minisiteColor: body.minisiteColor ?? undefined, slogan: body.slogan },
    })
  
    const newSlides = files.slides ?? []
    if (newSlides.length > metaCount) {
      throw new BadRequestException('Demasiados archivos para slidesMeta')
    }
    const plan = await this.plan(empresaId)
    const limitRow = await this.prisma.planFeature.findUnique({
      where: { plan_code: { plan, code: FeatureCode.BANNER_PRODUCT_SLOTS } },
    })
    if (limitRow?.limit != null && metaCount > limitRow.limit) {
      throw new BadRequestException(`Máximo ${limitRow.limit} slides permitidos`)
    }
  
    const minisiteId = await this.minisite(empresaId)
  
    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.minisiteSlide.findMany({
        where: { minisiteId },
        orderBy: { order: 'asc' },
      })
  
const uploads: Record<number, string> = {}
await Promise.all(
  newSlides.map(async (f, pos) => {
    const url = (await this.cloud.uploadImage(f)).secure_url
    this.log.debug(`uploaded idx=${pos} name=${f.originalname} url=${url}`)
    uploads[pos] = url
  }),
)

const data = body.slidesMeta.map((m, idx) => ({
  minisiteId,
  imageSrc: uploads[idx] ?? '',
  title: m.title ?? '',
  description: m.description ?? '',
  cta: m.cta ?? '',
  order: m.order ?? idx,
}))
  
      await tx.minisiteSlide.deleteMany({ where: { minisiteId } })
      await tx.minisiteSlide.createMany({ data })
  
      await tx.companyUsage.upsert({
        where: { companyId_code: { companyId: empresaId, code: FeatureCode.BANNER_PRODUCT_SLOTS } },
        update: { used: metaCount },
        create: { companyId: empresaId, code: FeatureCode.BANNER_PRODUCT_SLOTS, used: metaCount },
      })
    })
  
    this.log.verbose('setupMinisite ← ok')
    return { ok: true }
  }
  
  
  
  

  async bulkUpsertProductsIndexed(
    empresaId: string,
    meta: BulkProductMeta[],
    files: Record<number, { main?: Express.Multer.File; gallery: Express.Multer.File[] }>,
  ) {
    const minisiteId = await this.minisite(empresaId)
    const prepared = await Promise.all(
      meta.map(async (m, idx) => {
        const bucket = files[idx] ?? { gallery: [] }
        if (!bucket.main) throw new BadRequestException(`main_${idx} es obligatorio`)
        const mainUrl = (await this.cloud.uploadImage(bucket.main)).secure_url
        const galleryUrls = await Promise.all(bucket.gallery.map((g) => this.cloud.uploadImage(g).then((r) => r.secure_url)))
        return { meta: m, mainUrl, galleryUrls }
      }),
    )
    return this.prisma.$transaction(
      async (tx) => {
        const toCreate = prepared.filter((p) => !p.meta.id).length
        await this.checkQuota(empresaId, FeatureCode.PRODUCTS_TOTAL, toCreate)
        const delta: Record<FeatureCode, number> = {
          [FeatureCode.PRODUCTS_TOTAL]: 0,
          [FeatureCode.CATEGORIES_TOTAL]: 0,
          [FeatureCode.BANNER_PRODUCT_SLOTS]: 0,
          [FeatureCode.STATIC_IMAGES_TOTAL]: 0,
          [FeatureCode.FEATURED_PRODUCTS_TOTAL]: 0,
          [FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL]: 0,
          [FeatureCode.OFFER_PRODUCTS_TOTAL]: 0,
          [FeatureCode.CLASSROOM_TRANSMISSIONS_TOTAL]: 0,
          [FeatureCode.SPECIALITY_IMAGES_TOTAL]: 0,
        }
        const out: Array<{ productId: string; type: string }> = []
        for (const { meta: m, mainUrl, galleryUrls } of prepared) {
          if (!m.id && m.categoryId != null) {
            const current = await tx.product.count({ where: { companyId: empresaId, categoryId: m.categoryId } })
            if (current >= 12) throw new BadRequestException(`Categoría #${m.categoryId} ya tiene 12 productos`)
          }
          const presentationsArr =
            typeof (m as any).presentations === 'string'
              ? (m as any).presentations.split(',').map((s) => s.trim()).filter(Boolean)
              : (m as any).presentations ?? []
          const productData: Prisma.ProductUncheckedCreateInput = {
            name: m.name,
            description: m.description,
            companyId: empresaId,
            categoryId: m.categoryId ?? null,
            activeIngredients: m.activeIngredients ?? [],
            benefits: m.benefits ?? [],
            features: m.features ?? [],
            presentations: presentationsArr,
            isFeatured: m.isFeatured,
            isBestSeller: m.isBestSeller,
            isOnSale: m.isOnSale,
            lab: m.lab,
            problemAddressed: m.problemAddressed,
            imageMain: mainUrl,
            imageGallery: galleryUrls,
          }
          const product = m.id
            ? await tx.product.update({ where: { id: m.id }, data: productData })
            : await tx.product.create({ data: productData })
          if (!m.id) delta[FeatureCode.PRODUCTS_TOTAL]++
          const type = (m.type ?? 'NORMAL').toUpperCase()
          if (type === 'FEATURED') {
            await this.checkQuota(empresaId, FeatureCode.FEATURED_PRODUCTS_TOTAL, m.id ? 0 : 1)
            await tx.minisiteFeaturedProduct.upsert({
              where: { productId: product.id },
              update: { minisiteId, order: m.order ?? 0, tagline: m.tagline ?? '' },
              create: { minisiteId, productId: product.id, order: m.order ?? 0, tagline: m.tagline ?? '' },
            })
            if (!m.id) delta[FeatureCode.FEATURED_PRODUCTS_TOTAL]++
          } else if (type === 'HIGHLIGHT') {
            await this.checkQuota(empresaId, FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL, m.id ? 0 : 1)
            await tx.minisiteHighlightProduct.upsert({
              where: { minisiteId_productId: { minisiteId, productId: product.id } },
              update: { highlightFeatures: m.highlightFeatures ?? [], highlightDescription: m.highlightDescription ?? '' },
              create: { minisiteId, productId: product.id, highlightFeatures: m.highlightFeatures ?? [], highlightDescription: m.highlightDescription ?? '' },
            })
            if (!m.id) delta[FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL]++
          } else if (type === 'OFFER') {
            await this.checkQuota(empresaId, FeatureCode.OFFER_PRODUCTS_TOTAL, m.id ? 0 : 1)
            await tx.minisiteProductOffer.upsert({
              where: { minisiteId_productId: { minisiteId, productId: product.id } },
              update: { title: m.title ?? product.name, description: m.offerDescription ?? '' },
              create: { minisiteId, productId: product.id, title: m.title ?? product.name, description: m.offerDescription ?? '' },
            })
            if (!m.id) delta[FeatureCode.OFFER_PRODUCTS_TOTAL]++
          }
          out.push({ productId: product.id, type })
        }
        for (const [code, inc] of Object.entries(delta) as [FeatureCode, number][]) {
          if (inc === 0) continue
          await tx.companyUsage.upsert({
            where: { companyId_code: { companyId: empresaId, code } },
            update: { used: { increment: inc } },
            create: { companyId: empresaId, code, used: inc },
          })
        }
        return out
      },
      { maxWait: 10_000, timeout: 120_000 },
    )
  }


async getSpecialities(empresaId: string) {
  return this.prisma.minisiteSpeciality.findMany({
    where: { minisite: { empresaId } },
    select: { id: true, title: true, imageUrl: true },
  })
}

async registerSpecialities(
  empresaId: string,
  body: { specialitiesMeta: string },
  files: Express.Multer.File[],
) {
  const metas: Array<{ title: string }> = JSON.parse(body.specialitiesMeta || '[]')
  const count = metas.length

  await this.checkQuota(empresaId, FeatureCode.SPECIALITY_IMAGES_TOTAL, count)

  const minisiteId = await this.minisite(empresaId)
  const uploads = await Promise.all(files.map(f => this.cloud.uploadImage(f)))

  return this.prisma.$transaction(async tx => {
    await tx.minisiteSpeciality.deleteMany({ where: { minisiteId } })

    const data: Prisma.MinisiteSpecialityUncheckedCreateInput[] = metas.map((m, idx) => ({
      minisiteId,
      title: m.title,
      imageUrl: uploads[idx]?.secure_url ?? '',
    }))

    await tx.minisiteSpeciality.createMany({ data })

    await tx.companyUsage.upsert({
      where: { companyId_code: { companyId: empresaId, code: FeatureCode.SPECIALITY_IMAGES_TOTAL } },
      update: { used: count },
      create: { companyId: empresaId, code: FeatureCode.SPECIALITY_IMAGES_TOTAL, used: count },
    })

    return tx.minisiteSpeciality.findMany({
      where: { minisiteId },
      select: { id: true, title: true, imageUrl: true },
    })
  })
}


  private async plan(empresaId: string): Promise<SubscriptionType> {
    const e = await this.prisma.empresa.findUnique({ where: { id: empresaId }, select: { subscription: true } })
    if (!e?.subscription) throw new BadRequestException('Empresa sin plan')
    return e.subscription
  }

  private async minisite(empresaId: string): Promise<string> {
    const m = await this.prisma.minisite.findUnique({ where: { empresaId }, select: { id: true } })
    if (!m) throw new NotFoundException('Minisite no existe')
    return m.id
  }

  private async checkQuota(empresaId: string, code: FeatureCode, increment = 1) {
    const feature = await this.prisma.planFeature.findUnique({
      where: { plan_code: { plan: await this.plan(empresaId), code } },
    })
    if (!feature || feature.limit === null) return
    const usedNow = await this.prisma.companyUsage.findUnique({
      where: { companyId_code: { companyId: empresaId, code } },
    })
    if ((usedNow?.used ?? 0) + increment > feature.limit) throw new BadRequestException(`Límite de ${code} excedido`)
  }

  private async collect(empresaId: string, code: FeatureCode) {
    const usageRow = await this.prisma.companyUsage.findUnique({
      where: { companyId_code: { companyId: empresaId, code } },
    })
    const used = usageRow?.used ?? 0
    switch (code) {
      case FeatureCode.PRODUCTS_TOTAL:
        return {
          items: await this.prisma.product.findMany({ where: { companyId: empresaId }, select: { id: true, name: true } }),
          used,
        }
      case FeatureCode.CATEGORIES_TOTAL:
        return {
          items: await this.prisma.productCompanyCategory.findMany({
            where: { companyId: empresaId },
            select: { id: true, name: true },
          }),
          used,
        }
      case FeatureCode.BANNER_PRODUCT_SLOTS:
        return {
          items: await this.prisma.minisiteSlide.findMany({
            where: { minisite: { empresaId } },
            select: { id: true, title: true },
          }),
          used,
        }
      case FeatureCode.STATIC_IMAGES_TOTAL:
        return {
          items: await this.prisma.minisiteSlide.findMany({
            where: { minisite: { empresaId } },
            select: { id: true, title: true, imageSrc: true },
          }),
          used,
        }
      case FeatureCode.FEATURED_PRODUCTS_TOTAL:
        return {
          items: await this.prisma.minisiteFeaturedProduct.findMany({
            where: { minisite: { empresaId } },
            select: { id: true, productId: true },
          }),
          used,
        }
      case FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL:
        return {
          items: await this.prisma.minisiteHighlightProduct.findMany({
            where: { minisite: { empresaId } },
            select: { id: true, productId: true },
          }),
          used,
        }
      case FeatureCode.OFFER_PRODUCTS_TOTAL:
        return {
          items: await this.prisma.minisiteProductOffer.findMany({
            where: { minisite: { empresaId } },
            select: { id: true, productId: true },
          }),
          used,
        }
      case FeatureCode.CLASSROOM_TRANSMISSIONS_TOTAL:
        return {
          items: await this.prisma.classroom.findMany({
            select: { id: true, title: true },
          }),
          used,
        }
      case FeatureCode.SPECIALITY_IMAGES_TOTAL:
        return {
          items: await this.prisma.minisiteSpeciality.findMany({
            where: { minisite: { empresaId } },
            select: { id: true, title: true, imageUrl: true },
          }),
          used,
        }
      default:
        throw new BadRequestException('Código no soportado')
    }
  }

  async upsertMinisiteVideo(
    empresaId: string,
    file: Express.Multer.File,
  ): Promise<{ videoUrl: string }> {
    if (!file) throw new BadRequestException('El archivo «video» es obligatorio')
    const uploaded = await this.cloud.uploadVideo(file)
    await this.prisma.minisite.update({
      where: { empresaId },
      data: { videoUrl: uploaded.secure_url },
    })
    return { videoUrl: uploaded.secure_url }
  }



  async getMinisiteVideo(minisiteId: string): Promise<{ videoUrl: string }> {
    const minisite = await this.prisma.minisite.findUnique({
      where: { id: minisiteId },
      select: { videoUrl: true },
    })
    if (!minisite) throw new NotFoundException('Minisite no encontrado')
    if (!minisite.videoUrl) throw new NotFoundException('No hay video cargado para este minisite')
    return { videoUrl: minisite.videoUrl }
  }

}
