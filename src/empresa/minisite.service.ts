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
    console.log('[MinisiteService][quotas] start', { empresaId })
    try {
      const plan = await this.plan(empresaId)
      console.log('[MinisiteService][quotas] plan', { empresaId, plan })
      const limits = await this.prisma.planFeature.findMany({ where: { plan } })
      console.log('[MinisiteService][quotas] limits', { count: limits.length, limits })
      const out: UsageResponse[] = []
      for (const f of limits) {
        const { items, used } = await this.collect(empresaId, f.code)
        console.log('[MinisiteService][quotas] collect', { code: f.code, used, itemsCount: items.length })
        out.push({ code: f.code, limit: f.limit, used, items })
      }
      console.log('[MinisiteService][quotas] done', { empresaId, count: out.length })
      return out
    } catch (e) {
      console.error('[MinisiteService][quotas][error]', e)
      throw e
    }
  }

  async quota(empresaId: string, code: FeatureCode): Promise<UsageResponse> {
    console.log('[MinisiteService][quota] start', { empresaId, code })
    try {
      const plan = await this.plan(empresaId)
      const feature = await this.prisma.planFeature.findUnique({ where: { plan_code: { plan, code } } })
      console.log('[MinisiteService][quota] feature', { feature })
      if (!feature) {
        console.error('[MinisiteService][quota][error] Límite no definido', { empresaId, code })
        throw new BadRequestException('Límite no definido')
      }
      const { items, used } = await this.collect(empresaId, code)
      const res = { code, limit: feature.limit, used, items }
      console.log('[MinisiteService][quota] done', { empresaId, code, used, limit: feature.limit, itemsCount: items.length })
      return res
    } catch (e) {
      console.error('[MinisiteService][quota][error]', e)
      throw e
    }
  }

  async objects(empresaId: string) {
    console.log('[MinisiteService][objects] start', { empresaId })
    try {
      const plan = await this.plan(empresaId)
      const codes = await this.prisma.planFeature.findMany({ where: { plan }, select: { code: true } })
      console.log('[MinisiteService][objects] codes', { count: codes.length, codes })
      const obj = {} as Record<FeatureCode, any[]>
      for (const { code } of codes) {
        const { items } = await this.collect(empresaId, code)
        obj[code] = items
        console.log('[MinisiteService][objects] collected', { code, itemsCount: items.length })
      }
      console.log('[MinisiteService][objects] done', { keys: Object.keys(obj).length })
      return obj
    } catch (e) {
      console.error('[MinisiteService][objects][error]', e)
      throw e
    }
  }

  async objectsByCode(empresaId: string, code: FeatureCode) {
    console.log('[MinisiteService][objectsByCode] start', { empresaId, code })
    try {
      const res = (await this.collect(empresaId, code)).items
      console.log('[MinisiteService][objectsByCode] done', { code, itemsCount: res.length })
      return res
    } catch (e) {
      console.error('[MinisiteService][objectsByCode][error]', e)
      throw e
    }
  }

  async upsertProduct(
    empresaId: string,
    data: Omit<Prisma.ProductUncheckedCreateInput, 'companyId' | 'id'> &
      Partial<Prisma.ProductUncheckedUpdateInput> & { id?: string },
  ): Promise<Product> {
    console.log('[MinisiteService][upsertProduct] start', { empresaId, hasId: !!data.id, name: data.name, categoryId: (data as any).categoryId })
    try {
      await this.checkQuota(empresaId, FeatureCode.PRODUCTS_TOTAL, data.id ? 0 : 1)
      if (data.id) {
        const { id, ...upd } = data
        const updated = await this.prisma.product.update({ where: { id }, data: upd })
        console.log('[MinisiteService][upsertProduct] updated', { id, name: updated.name })
        return updated
      }
      const created = await this.prisma.product.create({ data: { ...data, companyId: empresaId } })
      console.log('[MinisiteService][upsertProduct] created', { id: created.id, name: created.name })
      return created
    } catch (e) {
      console.error('[MinisiteService][upsertProduct][error]', e)
      throw e
    }
  }

  async upsertBanner(
    empresaId: string,
    data: Omit<Prisma.BannerUncheckedCreateInput, 'empresaId' | 'id'> &
      Partial<Prisma.BannerUncheckedUpdateInput> & { id?: string },
  ): Promise<Banner> {
    console.log('[MinisiteService][upsertBanner] start', { empresaId, hasId: !!data.id })
    try {
      const existing = await this.prisma.banner.findFirst({ where: { empresaId } })
      console.log('[MinisiteService][upsertBanner] existing', { exists: !!existing, id: existing?.id })
      if (!data.id && existing) {
        console.error('[MinisiteService][upsertBanner][error] Ya existe un banner', { empresaId, existingId: existing.id })
        throw new BadRequestException('Ya existe un banner')
      }
      if (data.id) {
        const { id, ...upd } = data
        const updated = await this.prisma.banner.update({ where: { id }, data: upd })
        console.log('[MinisiteService][upsertBanner] updated', { id: updated.id })
        return updated
      }
      const created = await this.prisma.banner.create({ data: { ...data, empresaId } })
      console.log('[MinisiteService][upsertBanner] created', { id: created.id })
      return created
    } catch (e) {
      console.error('[MinisiteService][upsertBanner][error]', e)
      throw e
    }
  }

  async upsertFeatured(
    empresaId: string,
    data: { id?: string; productId: string; order?: number; tagline?: string },
  ): Promise<MinisiteFeaturedProduct> {
    console.log('[MinisiteService][upsertFeatured] start', { empresaId, hasId: !!data.id, productId: data.productId })
    try {
      await this.checkQuota(empresaId, FeatureCode.FEATURED_PRODUCTS_TOTAL, data.id ? 0 : 1)
      const minisiteId = await this.ensureMinisite(empresaId)
      if (data.id) {
        const { id, ...upd } = data
        const updated = await this.prisma.minisiteFeaturedProduct.update({ where: { id }, data: { ...upd, minisiteId } })
        console.log('[MinisiteService][upsertFeatured] updated', { id: updated.id })
        return updated
      }
      const created = await this.prisma.minisiteFeaturedProduct.create({ data: { ...data, minisiteId } })
      console.log('[MinisiteService][upsertFeatured] created', { id: created.id })
      return created
    } catch (e) {
      console.error('[MinisiteService][upsertFeatured][error]', e)
      throw e
    }
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
    console.log('[MinisiteService][upsertHighlight] start', { empresaId, hasId: !!data.id, productId: data.productId, highlightFeaturesLength: data.highlightFeatures?.length || 0 })
    try {
      const minisiteId = await this.ensureMinisite(empresaId)
      if (data.id) {
        const { id, ...upd } = data
        const updated = await this.prisma.minisiteHighlightProduct.update({ where: { id }, data: { ...upd, minisiteId } })
        console.log('[MinisiteService][upsertHighlight] updated', { id: updated.id })
        return updated
      }
      const upserted = await this.prisma.minisiteHighlightProduct.upsert({
        where: { minisiteId_productId: { minisiteId, productId: data.productId } },
        update: { ...data },
        create: { ...data, minisiteId },
      })
      console.log('[MinisiteService][upsertHighlight] upserted', { id: upserted.id })
      return upserted
    } catch (e) {
      console.error('[MinisiteService][upsertHighlight][error]', e)
      throw e
    }
  }

  async getMinisiteSetup(empresaId: string) {
    console.log('[MinisiteService][getMinisiteSetup] start', { empresaId })
    try {
      await this.ensureMinisite(empresaId)
      const plan = await this.plan(empresaId)
      const slotLimit = await this.prisma.planFeature.findUnique({
        where: { plan_code: { plan, code: FeatureCode.BANNER_PRODUCT_SLOTS } },
        select: { limit: true },
      })
      console.log('[MinisiteService][getMinisiteSetup] slotLimit', { limit: slotLimit?.limit ?? null })
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
      console.log('[MinisiteService][getMinisiteSetup] company', { found: !!company })
      if (!company) {
        console.error('[MinisiteService][getMinisiteSetup][error] Empresa no encontrada', { empresaId })
        throw new NotFoundException('Empresa no encontrada')
      }
      const slides = await this.prisma.minisiteSlide.findMany({
        where: { minisite: { empresaId } },
        select: { id: true, title: true, description: true, cta: true, imageSrc: true, order: true },
      })
      const banners = await this.prisma.banner.findMany({ where: { empresaId } })
      console.log('[MinisiteService][getMinisiteSetup] done', { slides: slides.length, banners: banners.length })
      return {
        company,
        minisiteColor: company.minisite?.minisiteColor ?? '#FFA500',
        slides,
        slideUsage: { used: slides.length, limit: slotLimit?.limit ?? null },
        banners,
      }
    } catch (e) {
      console.error('[MinisiteService][getMinisiteSetup][error]', e)
      throw e
    }
  }

  async setupMinisite(
    empresaId: string,
    body: {
      name: string
      description: string
      giro: Giro
      slogan?: string
      slidesMeta: Array<SlideMeta & { imageSrc?: string }>
      minisiteColor?: string
    },
    files: { logo?: Express.Multer.File; slides?: (Express.Multer.File | string)[] },
  ) {
    console.log('[MinisiteService][setupMinisite] start', {
      empresaId,
      name: body.name,
      descriptionLen: body.description?.length || 0,
      giro: body.giro,
      slogan: body.slogan || null,
      slidesMetaLen: body.slidesMeta?.length || 0,
      minisiteColor: body.minisiteColor || null,
      hasLogo: !!files.logo,
      slidesFilesLen: files.slides?.length || 0,
    })
    this.log.debug(`metaLen=${body.slidesMeta.length}`)
    try {
      await this.ensureMinisite(empresaId)
      let logoUrl: string | undefined
      if (files.logo) {
        const res = await this.cloud.uploadImage(files.logo)
        logoUrl = res.secure_url
        console.log('[MinisiteService][setupMinisite] logo uploaded', { logoUrl })
        this.log.debug(`logoUrl=${logoUrl}`)
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
      console.log('[MinisiteService][setupMinisite] empresa updated', { empresaId })

      await this.prisma.minisite.update({
        where: { empresaId },
        data: { minisiteColor: body.minisiteColor ?? '#FFA500', slogan: body.slogan ?? 'Bienvenido a nuestro minisite' },
      })
      console.log('[MinisiteService][setupMinisite] minisite updated', { empresaId, minisiteColor: body.minisiteColor || '#FFA500' })

      const uploads: Record<number, string> = {}
      await Promise.all(
        (files.slides ?? []).map(async (item, idx) => {
          if (typeof item !== 'string') {
            const url = (await this.cloud.uploadImage(item)).secure_url
            uploads[idx] = url
            console.log('[MinisiteService][setupMinisite] slide uploaded', { idx, url })
            this.log.debug(`uploaded slide[${idx}]=${url}`)
          } else {
            console.log('[MinisiteService][setupMinisite] slide uses existing url', { idx, url: item })
          }
        }),
      )

      const minisiteId = await this.ensureMinisite(empresaId)
      const existing = await this.prisma.minisiteSlide.findMany({
        where: { minisiteId },
        orderBy: { order: 'asc' },
      })
      console.log('[MinisiteService][setupMinisite] existing slides', { count: existing.length })

      const data: Prisma.MinisiteSlideUncheckedCreateInput[] = body.slidesMeta.map((m, idx) => {
        const imageSrc = uploads[idx] || m.imageSrc || existing[idx]?.imageSrc || ''
        this.log.debug(`final slide[${idx}]=${imageSrc}`)
        console.log('[MinisiteService][setupMinisite] final slide', { idx, imageSrc, title: m.title || '', order: m.order ?? idx })
        return {
          minisiteId,
          imageSrc,
          title: m.title ?? '',
          description: m.description ?? '',
          cta: m.cta ?? '',
          order: m.order ?? idx,
        }
      })

      await this.prisma.$transaction(async tx => {
        console.log('[MinisiteService][setupMinisite][tx] deleting slides', { minisiteId })
        await tx.minisiteSlide.deleteMany({ where: { minisiteId } })
        console.log('[MinisiteService][setupMinisite][tx] creating slides', { count: data.length })
        await tx.minisiteSlide.createMany({ data })
        console.log('[MinisiteService][setupMinisite][tx] updating usage', { used: data.length })
        await tx.companyUsage.upsert({
          where: { companyId_code: { companyId: empresaId, code: FeatureCode.BANNER_PRODUCT_SLOTS } },
          update: { used: data.length },
          create: { companyId: empresaId, code: FeatureCode.BANNER_PRODUCT_SLOTS, used: data.length },
        })
      })

      console.log('[MinisiteService][setupMinisite] done', { empresaId, slides: data.length })
      return { ok: true }
    } catch (e) {
      console.error('[MinisiteService][setupMinisite][error]', e)
      throw e
    }
  }

  async bulkUpsertProductsIndexed(
    empresaId: string,
    meta: BulkProductMeta[],
    files: Record<number, { main?: Express.Multer.File; gallery: Express.Multer.File[] }>,
  ) {
    console.log('[MinisiteService][bulkUpsertProductsIndexed] start', {
      empresaId,
      metaLen: meta.length,
      filesKeys: Object.keys(files || {}),
    })
    try {
      const minisiteId = await this.ensureMinisite(empresaId)
      console.log('[MinisiteService][bulkUpsertProductsIndexed] minisiteId', { minisiteId })

      type Prepared = {
        idx: number
        meta: BulkProductMeta
        mainUrl: string
        galleryUrls: string[]
      }

      type Result = {
        alias: number
        created: boolean
        type: string
        productId?: string
        message: string
      }

      const allowed: Prepared[] = []
      const results: Result[] = []

      for (let idx = 0; idx < meta.length; idx++) {
        const m = meta[idx]
        const branch = (m.type ?? 'NORMAL').toUpperCase()
        let message = ''
        let valid = true
        console.log('[MinisiteService][bulkUpsertProductsIndexed] validate item', {
          idx,
          alias: m.alias,
          hasId: !!m.id,
          branch,
          categoryId: m.categoryId ?? null,
        })

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
            console.log('[MinisiteService][bulkUpsertProductsIndexed] category count', { categoryId: m.categoryId, current })
            if (current >= 12) throw new BadRequestException(`Categoría #${m.categoryId} ya tiene 12 productos`)
          }

          const bucket = files[idx] ?? { gallery: [] }
          if (!bucket.main) throw new BadRequestException(`main_${idx} es obligatorio`)

          const mainUrl = (await this.cloud.uploadImage(bucket.main)).secure_url
          const galleryUrls = await Promise.all(
            (bucket.gallery || []).map(g => this.cloud.uploadImage(g).then(r => r.secure_url)),
          )
          console.log('[MinisiteService][bulkUpsertProductsIndexed] uploaded images', {
            idx,
            mainUrl,
            galleryLen: galleryUrls.length,
          })

          allowed.push({ idx, meta: m, mainUrl, galleryUrls })
        } catch (e) {
          valid = false
          message = (e as Error).message
          console.error('[MinisiteService][bulkUpsertProductsIndexed][validate][error]', { idx, alias: m.alias, message })
        }

        if (!valid) {
          results.push({
            alias: m.alias,
            created: false,
            type: branch,
            message,
          })
        }
      }

      console.log('[MinisiteService][bulkUpsertProductsIndexed] allowed', { count: allowed.length })
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
            const presentationsArr =
              Array.isArray(m.presentations)
                ? m.presentations
                : m.presentations ?? []

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

            const branch = (m.type ?? 'NORMAL').toUpperCase()
            console.log('[MinisiteService][bulkUpsertProductsIndexed][tx] product processed', {
              alias: m.alias,
              productId: product.id,
              branch,
            })

            if (branch === 'FEATURED') {
              await tx.minisiteFeaturedProduct.upsert({
                where: { productId: product.id },
                update: { minisiteId, order: m.order ?? 0, tagline: m.tagline ?? '' },
                create: { minisiteId, productId: product.id, order: m.order ?? 0, tagline: m.tagline ?? '' },
              })
              if (!m.id) delta[FeatureCode.FEATURED_PRODUCTS_TOTAL]++
              console.log('[MinisiteService][bulkUpsertProductsIndexed][tx] featured upserted', { productId: product.id })
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
              console.log('[MinisiteService][bulkUpsertProductsIndexed][tx] highlight upserted', { productId: product.id })
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
              console.log('[MinisiteService][bulkUpsertProductsIndexed][tx] offer upserted', { productId: product.id })
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
            console.log('[MinisiteService][bulkUpsertProductsIndexed][tx] usage updated', { code, inc })
          }

          console.log('[MinisiteService][bulkUpsertProductsIndexed][tx] done', { results: createdResults.length })
          return createdResults
        },
        { maxWait: 10_000, timeout: 120_000 },
      )

      const final = [...results, ...txResults]
      console.log('[MinisiteService][bulkUpsertProductsIndexed] done', { failed: results.length, createdOrUpdated: txResults.length, total: final.length })
      return final
    } catch (e) {
      console.error('[MinisiteService][bulkUpsertProductsIndexed][error]', e)
      throw e
    }
  }

  private async plan(empresaId: string): Promise<SubscriptionType> {
    console.log('[MinisiteService][plan] start', { empresaId })
    const e = await this.prisma.empresa.findUnique({ where: { id: empresaId }, select: { subscription: true } })
    console.log('[MinisiteService][plan] subscription', { subscription: e?.subscription || null })
    if (!e?.subscription) {
      console.error('[MinisiteService][plan][error] Empresa sin plan', { empresaId })
      throw new BadRequestException('Empresa sin plan')
    }
    return e.subscription
  }

  private async ensureMinisite(empresaId: string): Promise<string> {
    console.log('[MinisiteService][ensureMinisite] start', { empresaId })
    const existing = await this.prisma.minisite.findUnique({ where: { empresaId }, select: { id: true } })
    if (existing) {
      console.log('[MinisiteService][ensureMinisite] found', { id: existing.id })
      return existing.id
    }
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
    console.log('[MinisiteService][ensureMinisite] created', { id: created.id })
    return created.id
  }

  private async checkQuota(empresaId: string, code: FeatureCode, increment = 1) {
    console.log('[MinisiteService][checkQuota] start', { empresaId, code, increment })
    const feature = await this.prisma.planFeature.findUnique({
      where: { plan_code: { plan: await this.plan(empresaId), code } },
    })
    console.log('[MinisiteService][checkQuota] feature', { exists: !!feature, limit: feature?.limit ?? null })
    if (!feature || feature.limit === null) return
    const usedNow = await this.prisma.companyUsage.findUnique({
      where: { companyId_code: { companyId: empresaId, code } },
    })
    const next = (usedNow?.used ?? 0) + increment
    console.log('[MinisiteService][checkQuota] used', { usedNow: usedNow?.used ?? 0, next, limit: feature.limit })
    if (next > feature.limit) {
      console.error('[MinisiteService][checkQuota][error] Límite excedido', { empresaId, code, next, limit: feature.limit })
      throw new BadRequestException(`Límite de ${code} excedido`)
    }
  }

  private async collect(empresaId: string, code: FeatureCode) {
    console.log('[MinisiteService][collect] start', { empresaId, code })
    const usageRow = await this.prisma.companyUsage.findUnique({
      where: { companyId_code: { companyId: empresaId, code } },
    })
    const used = usageRow?.used ?? 0
    console.log('[MinisiteService][collect] used', { code, used })
    switch (code) {
      case FeatureCode.PRODUCTS_TOTAL: {
        const items = await this.prisma.product.findMany({ where: { companyId: empresaId }, select: { id: true, name: true } })
        console.log('[MinisiteService][collect] PRODUCTS_TOTAL', { itemsCount: items.length })
        return { items, used }
      }
      case FeatureCode.CATEGORIES_TOTAL: {
        const items = await this.prisma.productCompanyCategory.findMany({
          where: { companyId: empresaId },
          select: { id: true, name: true },
        })
        console.log('[MinisiteService][collect] CATEGORIES_TOTAL', { itemsCount: items.length })
        return { items, used }
      }
      case FeatureCode.BANNER_PRODUCT_SLOTS: {
        const items = await this.prisma.minisiteSlide.findMany({
          where: { minisite: { empresaId } },
          select: { id: true, title: true },
        })
        console.log('[MinisiteService][collect] BANNER_PRODUCT_SLOTS', { itemsCount: items.length })
        return { items, used }
      }
      case FeatureCode.STATIC_IMAGES_TOTAL: {
        const items = await this.prisma.minisiteSlide.findMany({
          where: { minisite: { empresaId } },
          select: { id: true, title: true, imageSrc: true },
        })
        console.log('[MinisiteService][collect] STATIC_IMAGES_TOTAL', { itemsCount: items.length })
        return { items, used }
      }
      case FeatureCode.FEATURED_PRODUCTS_TOTAL: {
        const items = await this.prisma.minisiteFeaturedProduct.findMany({
          where: { minisite: { empresaId } },
          select: { id: true, productId: true },
        })
        console.log('[MinisiteService][collect] FEATURED_PRODUCTS_TOTAL', { itemsCount: items.length })
        return { items, used }
      }
      case FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL: {
        const items = await this.prisma.minisiteHighlightProduct.findMany({
          where: { minisite: { empresaId } },
          select: { id: true, productId: true },
        })
        console.log('[MinisiteService][collect] HIGHLIGHT_PRODUCTS_TOTAL', { itemsCount: items.length })
        return { items, used }
      }
      case FeatureCode.OFFER_PRODUCTS_TOTAL: {
        const items = await this.prisma.minisiteProductOffer.findMany({
          where: { minisite: { empresaId } },
          select: { id: true, productId: true },
        })
        console.log('[MinisiteService][collect] OFFER_PRODUCTS_TOTAL', { itemsCount: items.length })
        return { items, used }
      }
      case FeatureCode.CLASSROOM_TRANSMISSIONS_TOTAL: {
        const items = await this.prisma.classroom.findMany({
          select: { id: true, title: true },
        })
        console.log('[MinisiteService][collect] CLASSROOM_TRANSMISSIONS_TOTAL', { itemsCount: items.length })
        return { items, used }
      }
      default:
        console.error('[MinisiteService][collect][error] Código no soportado', { code })
        throw new BadRequestException('Código no soportado')
    }
  }

  async upsertMinisiteVideo(
    empresaId: string,
    file: Express.Multer.File,
  ): Promise<{ videoUrl: string }> {
    console.log('[MinisiteService][upsertMinisiteVideo] start', { empresaId, hasFile: !!file, fileSize: file?.size || 0, fileMimetype: file?.mimetype || null })
    try {
      if (!file) {
        console.error('[MinisiteService][upsertMinisiteVideo][error] archivo faltante', { empresaId })
        throw new BadRequestException('El archivo «video» es obligatorio')
      }
      await this.ensureMinisite(empresaId)
      const uploaded = await this.cloud.uploadVideo(file)
      await this.prisma.minisite.update({
        where: { empresaId },
        data: { videoUrl: uploaded.secure_url },
      })
      console.log('[MinisiteService][upsertMinisiteVideo] done', { empresaId, videoUrl: uploaded.secure_url })
      return { videoUrl: uploaded.secure_url }
    } catch (e) {
      console.error('[MinisiteService][upsertMinisiteVideo][error]', e)
      throw e
    }
  }

  async getMinisiteVideoByCompany(empresaId: string): Promise<{ videoUrl: string }> {
    console.log('[MinisiteService][getMinisiteVideoByCompany] start', { empresaId })
    try {
      await this.ensureMinisite(empresaId)
      const m = await this.prisma.minisite.findUnique({
        where: { empresaId },
        select: { videoUrl: true },
      })
      console.log('[MinisiteService][getMinisiteVideoByCompany] minisite', { found: !!m, hasVideo: !!m?.videoUrl })
      if (!m) {
        console.error('[MinisiteService][getMinisiteVideoByCompany][error] Minisite no encontrado', { empresaId })
        throw new NotFoundException('Minisite no encontrado')
      }
      if (!m.videoUrl) {
        console.error('[MinisiteService][getMinisiteVideoByCompany][error] No hay video', { empresaId })
        throw new NotFoundException('No hay video cargado para esta empresa')
      }
      console.log('[MinisiteService][getMinisiteVideoByCompany] done', { empresaId, videoUrl: m.videoUrl })
      return { videoUrl: m.videoUrl }
    } catch (e) {
      console.error('[MinisiteService][getMinisiteVideoByCompany][error]', e)
      throw e
    }
  }
}
