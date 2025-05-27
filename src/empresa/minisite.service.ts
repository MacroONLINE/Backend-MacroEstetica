// src/empresa/minisite.service.ts
import {
    Injectable,
    BadRequestException,
    NotFoundException,
  } from '@nestjs/common';
  import {
    Prisma,
    FeatureCode,
    SubscriptionType,
    Product,
    Banner,
    MinisiteFeaturedProduct,
    MinisiteHighlightProduct,
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
  
  @Injectable()
  export class MinisiteService {
    constructor(
      private readonly prisma: PrismaService,
      private readonly cloud: CloudinaryService,
    ) {}
  
    /* ───────── cuotas & lecturas ───────── */
  
    async quotas(empresaId: string): Promise<UsageResponse[]> {
      const plan = await this.plan(empresaId);
      const limits = await this.prisma.planFeature.findMany({ where: { plan } });
      const out: UsageResponse[] = [];
      for (const f of limits) {
        const { items, used } = await this.collect(empresaId, f.code);
        out.push({ code: f.code, limit: f.limit, used, items });
      }
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
  
    /* ───────── configuración general + lote de slides ───────── */
  
    async setupMinisite(
      empresaId: string,
      body: {
        name: string;
        description: string;
        giro: Giro;
        slogan?: string;
        slidesMeta: SlideMeta[];
      },
      files: { logo?: Express.Multer.File; slides?: Express.Multer.File[] },
    ) {
      /* logo */
      let logoUrl: string | undefined;
      if (files.logo) {
        const res: UploadApiResponse = await this.cloud.uploadImage(files.logo);
        logoUrl = res.secure_url;
      }
  
      /* empresa */
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
  
      /* slides */
      const newSlides = files.slides ?? [];
      await this.checkQuota(
        empresaId,
        FeatureCode.STATIC_IMAGES_TOTAL,
        newSlides.length,
      );
  
      if (newSlides.length) {
        const uploads: UploadApiResponse[] = await Promise.all(
          newSlides.map((f) => this.cloud.uploadImage(f)),
        );
        const minisiteId = await this.minisite(empresaId);
        const data: Prisma.MinisiteSlideUncheckedCreateInput[] = uploads.map(
          (u, idx) => ({
            minisiteId,
            imageSrc: u.secure_url,
            title: body.slidesMeta[idx]?.title ?? '',
            description: body.slidesMeta[idx]?.description ?? '',
            cta: body.slidesMeta[idx]?.cta ?? '',
            order: body.slidesMeta[idx]?.order ?? idx,
          }),
        );
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
      const used = (await this.collect(empresaId, code)).used;
      if (used + increment > feature.limit) {
        throw new BadRequestException(`Límite de ${code} excedido`);
      }
    }
  
    private async collect(empresaId: string, code: FeatureCode) {
      switch (code) {
        case FeatureCode.PRODUCTS_TOTAL:
          return {
            items: await this.prisma.product.findMany({
              where: { companyId: empresaId },
              select: { id: true, name: true },
            }),
            used: await this.prisma.product.count({
              where: { companyId: empresaId },
            }),
          };
        case FeatureCode.CATEGORIES_TOTAL:
          return {
            items: await this.prisma.productCompanyCategory.findMany({
              where: { companyId: empresaId },
              select: { id: true, name: true },
            }),
            used: await this.prisma.productCompanyCategory.count({
              where: { companyId: empresaId },
            }),
          };
        case FeatureCode.BANNER_PRODUCT_SLOTS:
          return {
            items: await this.prisma.banner.findMany({
              where: { empresaId },
              select: { id: true, title: true },
            }),
            used: await this.prisma.banner.count({ where: { empresaId } }),
          };
        case FeatureCode.STATIC_IMAGES_TOTAL:
          return {
            items: await this.prisma.minisiteSlide.findMany({
              where: { minisite: { empresaId } },
              select: { id: true, title: true, imageSrc: true },
            }),
            used: await this.prisma.minisiteSlide.count({
              where: { minisite: { empresaId } },
            }),
          };
        case FeatureCode.FEATURED_PRODUCTS_TOTAL:
          return {
            items: await this.prisma.minisiteFeaturedProduct.findMany({
              where: { minisite: { empresaId } },
              select: { id: true, productId: true },
            }),
            used: await this.prisma.minisiteFeaturedProduct.count({
              where: { minisite: { empresaId } },
            }),
          };
        case FeatureCode.CLASSROOM_TRANSMISSIONS_TOTAL:
          return {
            items: await this.prisma.classroom.findMany({
              where: { orators: { some: { empresaId } } },
              select: { id: true, title: true },
            }),
            used: await this.prisma.classroom.count({
              where: { orators: { some: { empresaId } } },
            }),
          };
        default:
          throw new BadRequestException('Código no soportado');
      }
    }
  }
  