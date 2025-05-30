// src/empresa/minisite.service.ts
import {
    Injectable,
    BadRequestException,
    NotFoundException,
    Logger,
  } from '@nestjs/common';
  import {
    Prisma,
    FeatureCode,
    SubscriptionType,
    Product,
    Banner,
    MinisiteFeaturedProduct,
    MinisiteHighlightProduct,
    CompanyUsage,
    Giro,
  } from '@prisma/client';
  import { UploadApiResponse } from 'cloudinary';
  import { PrismaService } from '../prisma/prisma.service';
  import { CloudinaryService } from '../cloudinary/cloudinary.service';
  
  export interface UsageResponse<T = any> {
    code: FeatureCode;
    limit: number | null;
    used: number;
    items: T[];
  }
  
  type SlideMeta = {
    title: string;
    description?: string;
    cta?: string;
    order?: number;
  };
  
  export interface BulkProductMeta {
    alias: number;
    id?: string;
    type?: 'NORMAL' | 'FEATURED' | 'HIGHLIGHT' | 'OFFER';
    name: string;
    description?: string;
    categoryId?: number;
    order?: number;
    tagline?: string;
    highlightFeatures?: string[];
    highlightDescription?: string;
    title?: string;
    offerDescription?: string;
  }
  
  @Injectable()
  export class MinisiteService {
    constructor(
      private readonly prisma: PrismaService,
      private readonly cloud: CloudinaryService,
    ) {}
  
    /* ───────── cuotas & lecturas ───────── */
  
    async quotas(empresaId: string): Promise<UsageResponse[]> {
        const log = new Logger('MinisiteService/quotas');
      
        log.verbose(`⏩  empresaId = ${empresaId}`);
      
        /* 1.  plan & límites declarados en PlanFeature */
        const plan = await this.plan(empresaId);
        log.debug(`Plan detectado → ${plan}`);
      
        const limits = await this.prisma.planFeature.findMany({ where: { plan } });
        log.debug(`PlanFeature rows             : ${limits.length}`);
        log.debug(
          limits
            .map((r) => `· ${r.code.padEnd(30)} – limit: ${r.limit ?? '∞'}`)
            .join('\n'),
        );
      
        /* 2.  recorrer cada código y calcular “used / items” */
        const out: UsageResponse[] = [];
        for (const f of limits) {
          log.verbose(`↪️  procesando código: ${f.code}`);
      
          const { items, used } = await this.collect(empresaId, f.code);
      
          log.debug(
            `code=${f.code}  limit=${f.limit ?? '∞'}  used=${used}  items=${items.length}`,
          );
      
          out.push({ code: f.code, limit: f.limit, used, items });
        }
      
        log.verbose(`✅  quotas listo → registros devueltos: ${out.length}`);
        return out;
      }
  
    async quota(empresaId: string, code: FeatureCode): Promise<UsageResponse> {
      const plan = await this.plan(empresaId);
      const feature = await this.prisma.planFeature.findUnique({
        where: { plan_code: { plan, code } },
      });
      if (!feature) throw new BadRequestException('Límite no definido');
      const { items, used } = await this.collect(empresaId, code);
      return { code, limit: feature.limit, used, items };
    }
  
    async objects(empresaId: string) {
      const plan = await this.plan(empresaId);
      const codes = await this.prisma.planFeature.findMany({
        where: { plan },
        select: { code: true },
      });
      const obj = {} as Record<FeatureCode, any[]>;
      for (const { code } of codes)
        obj[code] = (await this.collect(empresaId, code)).items;
      return obj;
    }
  
    async objectsByCode(empresaId: string, code: FeatureCode) {
      return (await this.collect(empresaId, code)).items;
    }
  
    /* ───────── upserts unitarios ───────── */
  
    async upsertProduct(
      empresaId: string,
      data: Omit<Prisma.ProductUncheckedCreateInput, 'companyId' | 'id'> &
        Partial<Prisma.ProductUncheckedUpdateInput> & { id?: string },
    ): Promise<Product> {
      await this.checkQuota(
        empresaId,
        FeatureCode.PRODUCTS_TOTAL,
        data.id ? 0 : 1,
      );
      if (data.id) {
        const { id, ...upd } = data;
        return this.prisma.product.update({ where: { id }, data: upd });
      }
      return this.prisma.product.create({
        data: { ...data, companyId: empresaId },
      });
    }
  
    async upsertBanner(
      empresaId: string,
      data: Omit<Prisma.BannerUncheckedCreateInput, 'empresaId' | 'id'> &
        Partial<Prisma.BannerUncheckedUpdateInput> & { id?: string },
    ): Promise<Banner> {
      const existing = await this.prisma.banner.findFirst({
        where: { empresaId },
      });
      if (!data.id && existing)
        throw new BadRequestException('Ya existe un banner');
  
      if (data.id) {
        const { id, ...upd } = data;
        return this.prisma.banner.update({ where: { id }, data: upd });
      }
      return this.prisma.banner.create({
        data: { ...data, empresaId },
      });
    }
  
    async upsertFeatured(
      empresaId: string,
      data: { id?: string; productId: string; order?: number; tagline?: string },
    ): Promise<MinisiteFeaturedProduct> {
      await this.checkQuota(
        empresaId,
        FeatureCode.FEATURED_PRODUCTS_TOTAL,
        data.id ? 0 : 1,
      );
      const minisiteId = await this.minisite(empresaId);
  
      if (data.id) {
        const { id, ...upd } = data;
        return this.prisma.minisiteFeaturedProduct.update({
          where: { id },
          data: { ...upd, minisiteId },
        });
      }
      return this.prisma.minisiteFeaturedProduct.create({
        data: { ...data, minisiteId },
      });
    }
  
    async upsertHighlight(
      empresaId: string,
      data: {
        id?: string;
        productId: string;
        highlightFeatures: string[];
        highlightDescription?: string;
        hoghlightImageUrl?: string;
      },
    ): Promise<MinisiteHighlightProduct> {
      const minisiteId = await this.minisite(empresaId);
      if (data.id) {
        const { id, ...upd } = data;
        return this.prisma.minisiteHighlightProduct.update({
          where: { id },
          data: { ...upd, minisiteId },
        });
      }
      return this.prisma.minisiteHighlightProduct.upsert({
        where: {
          minisiteId_productId: { minisiteId, productId: data.productId },
        },
        update: { ...data },
        create: { ...data, minisiteId },
      });
    }
  
    async getMinisiteSetup(empresaId: string) {
        const plan = await this.plan(empresaId);
      
        /* límite de slots de banner/slide para el plan del cliente */
        const slotLimit = await this.prisma.planFeature.findUnique({
          where: { plan_code: { plan, code: FeatureCode.BANNER_PRODUCT_SLOTS } },
          select: { limit: true },
        });
      
        /* datos generales de la empresa + minisite (sin duplicar slides) */
        const company = await this.prisma.empresa.findUnique({
          where: { id: empresaId },
          select: {
            name: true,
            location: true,
            title: true,
            giro: true,
            profileImage: true,
            minisite: {
              select: {
                minisiteColor: true,
                slogan: true,
              },
            },
          },
        });
        if (!company) throw new NotFoundException('Empresa no encontrada');
      
        /* slides y banners reales */
        const slides  = await this.prisma.minisiteSlide.findMany({
          where: { minisite: { empresaId } },
          select: { id: true, title: true, imageSrc: true, order: true },
        });
      
        const banners = await this.prisma.banner.findMany({
          where: { empresaId },
        });
      
        return {
          company,
          minisiteColor: company.minisite?.minisiteColor ?? null,
          slides,
          slideUsage: { used: slides.length, limit: slotLimit?.limit ?? null },
          banners,
        };
      }
      
      async setupMinisite(
        empresaId: string,
        body: {
          name: string;
          description: string;
          giro: Giro;
          slogan?: string;
          slidesMeta: SlideMeta[];
          minisiteColor?: string;
        },
        files: { logo?: Express.Multer.File; slides?: Express.Multer.File[] },
      ) {
        let logoUrl: string | undefined;
        if (files.logo) {
          const res: UploadApiResponse = await this.cloud.uploadImage(files.logo);
          logoUrl = res.secure_url;
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
        });
      
        await this.prisma.minisite.update({
          where: { empresaId },
          data: {
            minisiteColor: body.minisiteColor ?? undefined,
            slogan: body.slogan,
          },
        });
      
        const newSlides = files.slides ?? [];
        await this.checkQuota(empresaId, FeatureCode.STATIC_IMAGES_TOTAL, newSlides.length);
      
        if (newSlides.length) {
          const uploads = await Promise.all(
            newSlides.map((f) => this.cloud.uploadImage(f)),
          );
          const minisiteId = await this.minisite(empresaId);
          const data: Prisma.MinisiteSlideUncheckedCreateInput[] = uploads.map((u, idx) => ({
            minisiteId,
            imageSrc: u.secure_url,
            title: body.slidesMeta[idx]?.title ?? '',
            description: body.slidesMeta[idx]?.description ?? '',
            cta: body.slidesMeta[idx]?.cta ?? '',
            order: body.slidesMeta[idx]?.order ?? idx,
          }));
          await this.prisma.minisiteSlide.createMany({ data });
        }
      
        return { ok: true };
      }

  
    /* ───────── helpers ───────── */
  
    private async plan(empresaId: string): Promise<SubscriptionType> {
      const e = await this.prisma.empresa.findUnique({
        where: { id: empresaId },
        select: { subscription: true },
      });
      if (!e?.subscription) throw new BadRequestException('Empresa sin plan');
      return e.subscription;
    }
  
    private async minisite(empresaId: string): Promise<string> {
      const m = await this.prisma.minisite.findUnique({
        where: { empresaId },
        select: { id: true },
      });
      if (!m) throw new NotFoundException('Minisite no existe');
      return m.id;
    }
  
    private async checkQuota(
      empresaId: string,
      code: FeatureCode,
      increment = 1,
    ) {
      const feature = await this.prisma.planFeature.findUnique({
        where: { plan_code: { plan: await this.plan(empresaId), code } },
      });
      if (!feature || feature.limit === null) return;
  
      const usedNow = await this.prisma.companyUsage.findUnique({
        where: { companyId_code: { companyId: empresaId, code } },
      });
  
      if ((usedNow?.used ?? 0) + increment > feature.limit) {
        throw new BadRequestException(`Límite de ${code} excedido`);
      }
    }
  
    private async collect(empresaId: string, code: FeatureCode) {
      const usageRow = await this.prisma.companyUsage.findUnique({
        where: { companyId_code: { companyId: empresaId, code } },
      });
  
      const used = usageRow?.used ?? 0;
  
      switch (code) {
        case FeatureCode.PRODUCTS_TOTAL:
          return {
            items: await this.prisma.product.findMany({
              where: { companyId: empresaId },
              select: { id: true, name: true },
            }),
            used,
          };
        case FeatureCode.CATEGORIES_TOTAL:
          return {
            items: await this.prisma.productCompanyCategory.findMany({
              where: { companyId: empresaId },
              select: { id: true, name: true },
            }),
            used,
          };
        case FeatureCode.BANNER_PRODUCT_SLOTS:
          return {
            items: await this.prisma.banner.findMany({
              where: { empresaId },
              select: { id: true, title: true },
            }),
            used,
          };
        case FeatureCode.STATIC_IMAGES_TOTAL:
          return {
            items: await this.prisma.minisiteSlide.findMany({
              where: { minisite: { empresaId } },
              select: { id: true, title: true, imageSrc: true },
            }),
            used,
          };
        case FeatureCode.FEATURED_PRODUCTS_TOTAL:
          return {
            items: await this.prisma.minisiteFeaturedProduct.findMany({
              where: { minisite: { empresaId } },
              select: { id: true, productId: true },
            }),
            used,
          };
        case FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL:
          return {
            items: await this.prisma.minisiteHighlightProduct.findMany({
              where: { minisite: { empresaId } },
              select: { id: true, productId: true },
            }),
            used,
          };
        case FeatureCode.OFFER_PRODUCTS_TOTAL:
          return {
            items: await this.prisma.minisiteProductOffer.findMany({
              where: { minisite: { empresaId } },
              select: { id: true, productId: true },
            }),
            used,
          };
        case FeatureCode.CLASSROOM_TRANSMISSIONS_TOTAL:
          return {
            items: await this.prisma.classroom.findMany({
              where: { orators: { some: { empresaId } } },
              select: { id: true, title: true },
            }),
            used,
          };
        default:
          throw new BadRequestException('Código no soportado');
      }
    }
  
    /* ───────── bulk products (con CompanyUsage) ───────── */
  
    async bulkUpsertProductsIndexed(
      empresaId: string,
      meta: BulkProductMeta[],
      files: Record<number, { main?: Express.Multer.File; gallery: Express.Multer.File[] }>,
    ) {
      const minisiteId = await this.minisite(empresaId);
  
      const prepared = await Promise.all(
        meta.map(async (m, idx) => {
          const bucket = files[idx] ?? { gallery: [] };
          if (!bucket.main) throw new BadRequestException(`main_${idx} es obligatorio`);
  
          const mainUrl = (await this.cloud.uploadImage(bucket.main)).secure_url;
          const galleryUrls = await Promise.all(
            bucket.gallery.map((g) => this.cloud.uploadImage(g).then((r) => r.secure_url)),
          );
  
          return { meta: m, mainUrl, galleryUrls };
        }),
      );
  
      return this.prisma.$transaction(
        async (tx) => {
          const toCreate = prepared.filter((p) => !p.meta.id).length;
          await this.checkQuota(empresaId, FeatureCode.PRODUCTS_TOTAL, toCreate);
  
          const delta: Record<FeatureCode, number> = {
            [FeatureCode.PRODUCTS_TOTAL]: 0,
            [FeatureCode.CATEGORIES_TOTAL]: 0,
            [FeatureCode.BANNER_PRODUCT_SLOTS]: 0,
            [FeatureCode.STATIC_IMAGES_TOTAL]: 0,
            [FeatureCode.FEATURED_PRODUCTS_TOTAL]: 0,
            [FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL]: 0,
            [FeatureCode.OFFER_PRODUCTS_TOTAL]: 0,
            [FeatureCode.CLASSROOM_TRANSMISSIONS_TOTAL]: 0,
          };
  
          const out: Array<{ productId: string; type: string }> = [];
  
          for (const { meta: m, mainUrl, galleryUrls } of prepared) {
            if (!m.id && m.categoryId != null) {
              const current = await tx.product.count({
                where: { companyId: empresaId, categoryId: m.categoryId },
              });
              if (current >= 12) {
                throw new BadRequestException(`Categoría #${m.categoryId} ya tiene 12 productos`);
              }
            }
  
            const productData: Prisma.ProductUncheckedCreateInput = {
              name: m.name,
              description: m.description ?? '',
              companyId: empresaId,
              categoryId: m.categoryId ?? null,
              imageMain: mainUrl,
              imageGallery: galleryUrls,
            };
  
            const product = m.id
              ? await tx.product.update({ where: { id: m.id }, data: productData })
              : await tx.product.create({ data: productData });
  
            if (!m.id) delta[FeatureCode.PRODUCTS_TOTAL]++;
  
            const type = (m.type ?? 'NORMAL').toUpperCase();
  
            if (type === 'FEATURED') {
              await this.checkQuota(empresaId, FeatureCode.FEATURED_PRODUCTS_TOTAL, m.id ? 0 : 1);
              await tx.minisiteFeaturedProduct.upsert({
                where: { productId: product.id },
                update: { minisiteId, order: m.order ?? 0, tagline: m.tagline ?? '' },
                create: { minisiteId, productId: product.id, order: m.order ?? 0, tagline: m.tagline ?? '' },
              });
              if (!m.id) delta[FeatureCode.FEATURED_PRODUCTS_TOTAL]++;
  
            } else if (type === 'HIGHLIGHT') {
              await this.checkQuota(empresaId, FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL, m.id ? 0 : 1);
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
              });
              if (!m.id) delta[FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL]++;
  
            } else if (type === 'OFFER') {
              await this.checkQuota(empresaId, FeatureCode.OFFER_PRODUCTS_TOTAL, m.id ? 0 : 1);
              await tx.minisiteProductOffer.upsert({
                where: { minisiteId_productId: { minisiteId, productId: product.id } },
                update: { title: m.title ?? product.name, description: m.offerDescription ?? '' },
                create: { minisiteId, productId: product.id, title: m.title ?? product.name, description: m.offerDescription ?? '' },
              });
              if (!m.id) delta[FeatureCode.OFFER_PRODUCTS_TOTAL]++;
            }
  
            out.push({ productId: product.id, type });
          }
  
          for (const [code, inc] of Object.entries(delta) as [FeatureCode, number][]) {
            if (inc === 0) continue;
            await tx.companyUsage.upsert({
              where: { companyId_code: { companyId: empresaId, code } },
              update: { used: { increment: inc } },
              create: { companyId: empresaId, code, used: inc },
            });
          }
  
          return out;
        },
        { maxWait: 10_000, timeout: 60_000 },
      );
    }
  }
  