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
    MinisiteSlide,
  } from '@prisma/client';
  import { PrismaService } from '../prisma/prisma.service';
  
  export interface UsageResponse<T = any> {
    code: FeatureCode;
    limit: number | null;
    used: number;
    items: T[];
  }
  
  type SlidePayload = {
    id?: string;
    title: string;
    description?: string;
    cta?: string;
    imageSrc?: string;
    order?: number;
  };
  
  @Injectable()
  export class MinisiteService {
    constructor(private readonly prisma: PrismaService) {}
  
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
  
    async quota(
      empresaId: string,
      code: FeatureCode,
    ): Promise<UsageResponse> {
      const plan = await this.plan(empresaId);
      const feature = await this.prisma.planFeature.findUnique({
        where: { plan_code: { plan, code } },
      });
      if (!feature) throw new BadRequestException('Límite no definido');
      const { items, used } = await this.collect(empresaId, code);
      return { code, limit: feature.limit, used, items };
    }
  
    async objects(
      empresaId: string,
    ): Promise<Record<FeatureCode, any[]>> {
      const plan = await this.plan(empresaId);
      const codes = await this.prisma.planFeature.findMany({
        where: { plan },
        select: { code: true },
      });
      const obj: Record<FeatureCode, any[]> = {} as any;
      for (const { code } of codes) {
        obj[code] = (await this.collect(empresaId, code)).items;
      }
      return obj;
    }
  
    async objectsByCode(
      empresaId: string,
      code: FeatureCode,
    ): Promise<any[]> {
      return (await this.collect(empresaId, code)).items;
    }
  
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
        return this.prisma.product.update({
          where: { id },
          data: upd as Prisma.ProductUncheckedUpdateInput,
        });
      }
      return this.prisma.product.create({
        data: { ...data, companyId: empresaId } as Prisma.ProductUncheckedCreateInput,
      });
    }
  
    async upsertBanner(
      empresaId: string,
      data: Omit<Prisma.BannerUncheckedCreateInput, 'empresaId' | 'id'> &
        Partial<Prisma.BannerUncheckedUpdateInput> & { id?: string },
    ): Promise<Banner> {
      const existing = await this.prisma.banner.findFirst({ where: { empresaId } });
      if (!data.id && existing) throw new BadRequestException('Ya existe un banner');
      if (data.id) {
        const { id, ...upd } = data;
        return this.prisma.banner.update({
          where: { id },
          data: upd as Prisma.BannerUncheckedUpdateInput,
        });
      }
      return this.prisma.banner.create({
        data: { ...data, empresaId } as Prisma.BannerUncheckedCreateInput,
      });
    }
  
    async upsertFeatured(
      empresaId: string,
      data: {
        id?: string;
        productId: string;
        order?: number;
        tagline?: string;
      },
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
        where: { minisiteId_productId: { minisiteId, productId: data.productId } },
        update: { ...data },
        create: { ...data, minisiteId },
      });
    }
  
    async upsertSlide(
      empresaId: string,
      payload: SlidePayload,
    ): Promise<MinisiteSlide> {
      await this.checkQuota(
        empresaId,
        FeatureCode.STATIC_IMAGES_TOTAL,
        payload.id ? 0 : 1,
      );
      const minisiteId = await this.minisite(empresaId);
      if (payload.id) {
        const { id, ...upd } = payload;
        return this.prisma.minisiteSlide.update({
          where: { id },
          data: upd,
        });
      }
      const createData: Prisma.MinisiteSlideUncheckedCreateInput = {
        minisiteId,
        title: payload.title,
        description: payload.description ?? '',
        cta: payload.cta ?? '',
        imageSrc: payload.imageSrc ?? '',
        order: payload.order ?? 0,
      };
      return this.prisma.minisiteSlide.create({ data: createData });
    }
  
    private async plan(empresaId: string): Promise<SubscriptionType> {
      const e = await this.prisma.empresa.findUnique({
        where: { id: empresaId },
        select: { subscription: true },
      });
      if (!e?.subscription) throw new BadRequestException('Empresa sin plan');
      return e.subscription as SubscriptionType;
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
    ): Promise<void> {
      const feature = await this.prisma.planFeature.findUnique({
        where: {
          plan_code: { plan: await this.plan(empresaId), code },
        },
      });
      if (!feature || feature.limit === null) return;
      const used = (await this.collect(empresaId, code)).used;
      if (used + increment > feature.limit) {
        throw new BadRequestException(`Límite de ${code} excedido`);
      }
    }
  
    private async collect(empresaId: string, code: FeatureCode) {
      let items: any[] = [];
      switch (code) {
        case FeatureCode.PRODUCTS_TOTAL:
          items = await this.prisma.product.findMany({
            where: { companyId: empresaId },
            select: { id: true, name: true, createdAt: true },
          });
          break;
        case FeatureCode.CATEGORIES_TOTAL:
          items = await this.prisma.productCompanyCategory.findMany({
            where: { companyId: empresaId },
            select: { id: true, name: true },
          });
          break;
        case FeatureCode.BANNER_PRODUCT_SLOTS:
          items = await this.prisma.banner.findMany({
            where: { empresaId },
            select: { id: true, title: true, banner: true },
          });
          break;
        case FeatureCode.STATIC_IMAGES_TOTAL:
          items = await this.prisma.minisiteSlide.findMany({
            where: { minisite: { empresaId } },
            select: { id: true, title: true, imageSrc: true },
          });
          break;
        case FeatureCode.FEATURED_PRODUCTS_TOTAL:
          items = await this.prisma.minisiteFeaturedProduct.findMany({
            where: { minisite: { empresaId } },
            select: { id: true, productId: true, order: true },
          });
          break;
        case FeatureCode.CLASSROOM_TRANSMISSIONS_TOTAL:
          items = await this.prisma.classroom.findMany({
            where: { orators: { some: { empresaId } } },
            select: { id: true, title: true, startDateTime: true },
          });
          break;
        default:
          throw new BadRequestException('Código no soportado');
      }
      return { items, used: items.length };
    }
  }
  