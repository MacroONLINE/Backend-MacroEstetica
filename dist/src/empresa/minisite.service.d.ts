import { Prisma, FeatureCode, Product, Banner, MinisiteFeaturedProduct, MinisiteHighlightProduct, Profession } from '@prisma/client';
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
export declare class MinisiteService {
    private readonly prisma;
    private readonly cloud;
    constructor(prisma: PrismaService, cloud: CloudinaryService);
    quotas(empresaId: string): Promise<UsageResponse[]>;
    quota(empresaId: string, code: FeatureCode): Promise<UsageResponse>;
    objects(empresaId: string): Promise<Record<import(".prisma/client").$Enums.FeatureCode, any[]>>;
    objectsByCode(empresaId: string, code: FeatureCode): Promise<{
        id: string;
        name: string;
    }[] | {
        id: number;
        name: string;
    }[] | {
        id: string;
        title: string;
    }[] | {
        id: string;
        productId: string;
    }[]>;
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
    setupMinisite(empresaId: string, body: {
        name: string;
        description: string;
        categories: Profession[];
        slogan?: string;
        slidesMeta: SlideMeta[];
    }, files: {
        logo?: Express.Multer.File;
        slides?: Express.Multer.File[];
    }): Promise<{
        ok: boolean;
    }>;
    private plan;
    private minisite;
    private checkQuota;
    private collect;
}
export {};
