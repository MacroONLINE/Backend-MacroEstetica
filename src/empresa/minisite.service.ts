import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common'
import {
  Prisma,
  FeatureCode,
  SubscriptionType,
  Product,
  Banner,
  MinisiteFeaturedProduct,
  MinisiteHighlightProduct,
  Giro,
} from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CloudinaryService } from '../cloudinary/cloudinary.service'

type CloudImageUpload = { secure_url: string }
type CloudVideoUpload = { secure_url: string }

export interface UsageResponse<T = unknown> {
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
  imageSrc?: string
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

  async objects(empresaId: string): Promise<Record<FeatureCode, unknown[]>> {
    const plan = await this.plan(empresaId)
    const codes = await this.prisma.planFeature.findMany({ where: { plan }, select: { code: true } })
    const obj: Record<FeatureCode, unknown[]> = {} as Record<FeatureCode, unknown[]>
    for (const { code } of codes) {
      const { items } = await this.collect(empresaId, code)
      obj[code] = items
    }
    return obj
  }

  async objectsByCode(empresaId: string, code: FeatureCode): Promise<unknown[]> {
    const res = (await this.collect(empresaId, code)).items
    return res
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
    const minisiteId = await this.ensureMinisite(empresaId)
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
    const minisiteId = await this.ensureMinisite(empresaId)
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
    await this.ensureMinisite(empresaId)
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
      orderBy: { order: 'asc' },
    })
    const banners = await this.prisma.banner.findMany({ where: { empresaId } })
    return {
      company,
      minisiteColor: company.minisite?.minisiteColor ?? '#FFA500',
      slides,
      slideUsage: { used: slides.length, limit: slotLimit?.limit ?? null },
      banners,
    }
  }

  async setupMinisite(
    empresaId: string,
    body: {
      name: string
      description: string
      giro: Giro
      slogan?: string
      slidesMeta: Array<SlideMeta>
      minisiteColor?: string
    },
    files: { logo?: Express.Multer.File; slides?: (Express.Multer.File | string)[] },
  ) {
    await this.ensureMinisite(empresaId)
    const desc = (body.description ?? '').slice(0, 500)
    const slogan = (body.slogan ?? '').slice(0, 100)
    let logoUrl: string | undefined
    if (files.logo) {
      const res: CloudImageUpload = await this.cloud.uploadImage(files.logo)
      logoUrl = res.secure_url
    }
    await this.prisma.empresa.update({
      where: { id: empresaId },
      data: {
        name: body.name,
        profileImage: logoUrl,
        title: slogan,
        location: desc,
        giro: body.giro,
      },
    })
    await this.prisma.minisite.update({
      where: { empresaId },
      data: { minisiteColor: body.minisiteColor ?? '#FFA500', slogan },
    })
    const uploads: Record<number, string> = {}
    await Promise.all(
      (files.slides ?? []).map(async (item, idx) => {
        if (typeof item !== 'string') {
          const url = (await this.cloud.uploadImage(item as Express.Multer.File)).secure_url
          uploads[idx] = url
        }
      }),
    )
    const minisiteId = await this.ensureMinisite(empresaId)
    const existing = await this.prisma.minisiteSlide.findMany({
      where: { minisiteId },
      orderBy: { order: 'asc' },
    })
    const data: Prisma.MinisiteSlideUncheckedCreateInput[] = body.slidesMeta.map((m, idx) => {
      const imageSrc = uploads[idx] || m.imageSrc || existing[idx]?.imageSrc || ''
      return {
        minisiteId,
        imageSrc,
        title: m.title ?? '',
        description: (m.description ?? '').slice(0, 500),
        cta: m.cta ?? '',
        order: m.order ?? idx,
      }
    })
    await this.prisma.$transaction(async tx => {
      await tx.minisiteSlide.deleteMany({ where: { minisiteId } })
      await tx.minisiteSlide.createMany({ data })
      await tx.companyUsage.upsert({
        where: { companyId_code: { companyId: empresaId, code: FeatureCode.BANNER_PRODUCT_SLOTS } },
        update: { used: data.length },
        create: { companyId: empresaId, code: FeatureCode.BANNER_PRODUCT_SLOTS, used: data.length },
      })
    })
    return { ok: true }
  }

  async bulkUpsertProductsIndexed(
    empresaId: string,
    meta: BulkProductMeta[],
    files: Record<number, { main?: Express.Multer.File; gallery: Express.Multer.File[] }>,
  ) {
    const minisiteId = await this.ensureMinisite(empresaId)

    type Prepared = {
      idx: number
      meta: BulkProductMeta
      mainUrl: string
      galleryUrls: string[]
    }

    type Result = {
      alias: number
      created: boolean
      type: 'NORMAL' | 'FEATURED' | 'HIGHLIGHT' | 'OFFER'
      productId?: string
      message: string
    }

    const allowed: Prepared[] = []
    const results: Result[] = []

    for (let idx = 0; idx < meta.length; idx++) {
      const m = meta[idx]
      const branch = (m.type ?? 'NORMAL').toUpperCase() as Result['type']
      let valid = true
      let message = ''
      try {
        if (branch === 'FEATURED') {
          await this.checkQuota(empresaId, FeatureCode.FEATURED_PRODUCTS_TOTAL, m.id ? 0 : 1)
        } else if (branch === 'HIGHLIGHT') {
          await this.checkQuota(empresaId, FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL, m.id ? 0 : 1)
        } else if (branch === 'OFFER') {
          await this.checkQuota(empresaId, FeatureCode.OFFER_PRODUCTS_TOTAL, m.id ? 0 : 1)
        }
        await this.checkQuota(empresaId, FeatureCode.PRODUCTS_TOTAL, m.id ? 0 : 1)
        if (!m.id && m.categoryId !== undefined && m.categoryId !== null) {
          const current = await this.prisma.product.count({
            where: { companyId: empresaId, categoryId: m.categoryId },
          })
          if (current >= 12) throw new BadRequestException(`Categoría #${m.categoryId} ya tiene 12 productos`)
        }
        const bucket = files[idx] ?? { gallery: [] as Express.Multer.File[] }
        if (!bucket.main) throw new BadRequestException(`main_${idx} es obligatorio`)
        const mainUrl = (await this.cloud.uploadImage(bucket.main)).secure_url
        const galleryUrls = await Promise.all(
          (bucket.gallery || []).map(g => this.cloud.uploadImage(g).then(r => (r as CloudImageUpload).secure_url)),
        )
        allowed.push({ idx, meta: m, mainUrl, galleryUrls })
      } catch (e) {
        valid = false
        message = (e as Error).message
      }
      if (!valid) {
        results.push({ alias: m.alias, created: false, type: branch, message })
      }
    }

    const txResults = await this.prisma.$transaction(
      async tx => {
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
        const createdResults: Result[] = []
        for (const { meta: m, mainUrl, galleryUrls } of allowed) {
          const presentationsArr = Array.isArray(m.presentations) ? m.presentations : m.presentations ?? []
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
          const branch = (m.type ?? 'NORMAL').toUpperCase() as Result['type']
          if (branch === 'FEATURED') {
            await tx.minisiteFeaturedProduct.upsert({
              where: { productId: product.id },
              update: { minisiteId, order: m.order ?? 0, tagline: m.tagline ?? '' },
              create: { minisiteId, productId: product.id, order: m.order ?? 0, tagline: m.tagline ?? '' },
            })
            if (!m.id) delta[FeatureCode.FEATURED_PRODUCTS_TOTAL]++
          } else if (branch === 'HIGHLIGHT') {
            await tx.minisiteHighlightProduct.upsert({
              where: { minisiteId_productId: { minisiteId, productId: product.id } },
              update: {
                highlightFeatures: m.highlightFeatures ?? [],
                highlightDescription: m.highlightDescription ?? '',
              },
              create: {
                minisiteId,
                productId: product.id,
                highlightFeatures: m.highlightFeatures ?? [],
                highlightDescription: m.highlightDescription ?? '',
              },
            })
            if (!m.id) delta[FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL]++
          } else if (branch === 'OFFER') {
            await tx.minisiteProductOffer.upsert({
              where: { minisiteId_productId: { minisiteId, productId: product.id } },
              update: { title: m.title ?? product.name, description: m.offerDescription ?? '' },
              create: {
                minisiteId,
                productId: product.id,
                title: m.title ?? product.name,
                description: m.offerDescription ?? '',
              },
            })
            if (!m.id) delta[FeatureCode.OFFER_PRODUCTS_TOTAL]++
          }
          createdResults.push({
            alias: m.alias,
            created: true,
            type: branch,
            productId: product.id,
            message: 'Producto procesado correctamente',
          })
        }
        for (const [code, inc] of Object.entries(delta) as [FeatureCode, number][]) {
          if (inc === 0) continue
          await tx.companyUsage.upsert({
            where: { companyId_code: { companyId: empresaId, code } },
            update: { used: { increment: inc } },
            create: { companyId: empresaId, code, used: inc },
          })
        }
        return createdResults
      },
      { maxWait: 10_000, timeout: 120_000 },
    )

    const final = [...results, ...txResults]
    return final
  }

  private async plan(empresaId: string): Promise<SubscriptionType> {
    const now = new Date()
    const active = await this.prisma.empresaSubscription.findFirst({
      where: { empresaId, status: 'active', endDate: { gte: now } },
      orderBy: { endDate: 'desc' },
      include: { subscription: { select: { type: true } } },
    })
    if (active?.subscription?.type) return active.subscription.type
    const e = await this.prisma.empresa.findUnique({ where: { id: empresaId }, select: { subscription: true } })
    if (!e?.subscription) throw new BadRequestException('Empresa sin plan')
    return e.subscription
  }

  private async ensureMinisite(empresaId: string): Promise<string> {
    const existing = await this.prisma.minisite.findUnique({ where: { empresaId }, select: { id: true } })
    if (existing) return existing.id
    const created = await this.prisma.minisite.create({
      data: {
        empresaId,
        minisiteColor: '#FFA500',
        slogan: 'Bienvenido a nuestro minisite',
        aboutDescription: { text: 'Conoce nuestros productos y servicios' },
        followersCount: 0,
        coursesCount: 0,
        productsCount: 0,
        catalogueUrl: 'https://example.com/catalogo',
      },
      select: { id: true },
    })
    return created.id
  }

  private async checkQuota(empresaId: string, code: FeatureCode, increment = 1) {
    const feature = await this.prisma.planFeature.findUnique({
      where: { plan_code: { plan: await this.plan(empresaId), code } },
    })
    if (!feature || feature.limit === null) return
    const usedNow = await this.prisma.companyUsage.findUnique({
      where: { companyId_code: { companyId: empresaId, code } },
    })
    const next = (usedNow?.used ?? 0) + increment
    if (next > feature.limit) throw new BadRequestException(`Límite de ${code} excedido`)
  }

  private async collect(empresaId: string, code: FeatureCode): Promise<{ items: unknown[]; used: number }> {
    const usageRow = await this.prisma.companyUsage.findUnique({
      where: { companyId_code: { companyId: empresaId, code } },
    })
    const used = usageRow?.used ?? 0
    switch (code) {
      case FeatureCode.PRODUCTS_TOTAL: {
        const items = await this.prisma.product.findMany({ where: { companyId: empresaId }, select: { id: true, name: true } })
        return { items, used }
      }
      case FeatureCode.CATEGORIES_TOTAL: {
        const items = await this.prisma.productCompanyCategory.findMany({
          where: { companyId: empresaId },
          select: { id: true, name: true },
        })
        return { items, used }
      }
      case FeatureCode.BANNER_PRODUCT_SLOTS: {
        const items = await this.prisma.minisiteSlide.findMany({
          where: { minisite: { empresaId } },
          select: { id: true, title: true },
        })
        return { items, used }
      }
      case FeatureCode.STATIC_IMAGES_TOTAL: {
        const items = await this.prisma.minisiteSlide.findMany({
          where: { minisite: { empresaId } },
          select: { id: true, title: true, imageSrc: true },
        })
        return { items, used }
      }
      case FeatureCode.FEATURED_PRODUCTS_TOTAL: {
        const items = await this.prisma.minisiteFeaturedProduct.findMany({
          where: { minisite: { empresaId } },
          select: { id: true, productId: true },
        })
        return { items, used }
      }
      case FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL: {
        const items = await this.prisma.minisiteHighlightProduct.findMany({
          where: { minisite: { empresaId } },
          select: { id: true, productId: true },
        })
        return { items, used }
      }
      case FeatureCode.OFFER_PRODUCTS_TOTAL: {
        const items = await this.prisma.minisiteProductOffer.findMany({
          where: { minisite: { empresaId } },
          select: { id: true, productId: true },
        })
        return { items, used }
      }
      case FeatureCode.CLASSROOM_TRANSMISSIONS_TOTAL: {
        const items = await this.prisma.classroom.findMany({
          select: { id: true, title: true },
        })
        return { items, used }
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
    await this.ensureMinisite(empresaId)
    const uploaded: CloudVideoUpload = await this.cloud.uploadVideo(file)
    await this.prisma.minisite.update({
      where: { empresaId },
      data: { videoUrl: uploaded.secure_url },
    })
    return { videoUrl: uploaded.secure_url }
  }

  async getMinisiteVideoByCompany(empresaId: string): Promise<{ videoUrl: string }> {
    await this.ensureMinisite(empresaId)
    const m = await this.prisma.minisite.findUnique({
      where: { empresaId },
      select: { videoUrl: true },
    })
    if (!m) throw new NotFoundException('Minisite no encontrado')
    if (!m.videoUrl) throw new NotFoundException('No hay video cargado para esta empresa')
    return { videoUrl: m.videoUrl }
  }

  async empresaPlanForUser(userId: string): Promise<{ plan: { type: SubscriptionType | 'UPDATE' | null } }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { userSubscription: true, empresa: { select: { id: true } } },
    })
    const upgrade = (user?.userSubscription ?? '').toUpperCase() === 'UPDATE'
    let companyType: SubscriptionType | null = null
    if (user?.empresa?.id) {
      try {
        companyType = await this.plan(user.empresa.id)
      } catch {
        companyType = null
      }
    }
    const type = companyType ?? (upgrade ? 'UPDATE' : null)
    return { plan: { type } }
  }
}
