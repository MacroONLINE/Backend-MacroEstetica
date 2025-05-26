import { Prisma, FeatureCode, Product, Banner, MinisiteFeaturedProduct, MinisiteHighlightProduct, MinisiteSlide } from '@prisma/client';
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
export declare class MinisiteService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    quotas(empresaId: string): Promise<UsageResponse[]>;
    quota(empresaId: string, code: FeatureCode): Promise<UsageResponse>;
    objects(empresaId: string): Promise<Record<FeatureCode, any[]>>;
    objectsByCode(empresaId: string, code: FeatureCode): Promise<any[]>;
    upsertProduct(empresaId: string, data: Omit<Prisma.ProductUncheckedCreateInput, 'companyId' | 'id'> & Partial<Prisma.ProductUncheckedUpdateInput> & {
        id?: string;
    }): Promise<Product>;
    upsertBanner(empresaId: string, data: Omit<Prisma.BannerUncheckedCreateInput, 'empresaId' | 'id'> & Partial<Prisma.BannerUncheckedUpdateInput> & {
        id?: string;
    }): Promise<Banner>;
    upsertFeatured(empresaId: string, data: {
        id?: string;
        productId: string;
        order?: number;
        tagline?: string;
    }): Promise<MinisiteFeaturedProduct>;
    upsertHighlight(empresaId: string, data: {
        id?: string;
        productId: string;
        highlightFeatures: string[];
        highlightDescription?: string;
        hoghlightImageUrl?: string;
    }): Promise<MinisiteHighlightProduct>;
    upsertSlide(empresaId: string, payload: SlidePayload): Promise<MinisiteSlide>;
    private plan;
    private minisite;
    private checkQuota;
    private collect;
}
export {};
