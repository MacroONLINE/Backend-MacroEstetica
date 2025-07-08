import { Prisma, FeatureCode, Product, Banner, MinisiteFeaturedProduct, MinisiteHighlightProduct, Giro } from '@prisma/client';
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
    description: string;
    categoryId?: number;
    activeIngredients?: string[];
    benefits?: string[];
    features?: string[];
    isFeatured?: boolean;
    presentations?: string[];
    isBestSeller?: boolean;
    isOnSale?: boolean;
    lab?: string;
    problemAddressed?: string;
    order?: number;
    tagline?: string;
    highlightFeatures?: string[];
    highlightDescription?: string;
    title?: string;
    offerDescription?: string;
}
export declare class MinisiteService {
    private readonly prisma;
    private readonly cloud;
    private readonly log;
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
    getMinisiteSetup(empresaId: string): Promise<{
        company: {
            name: string;
            title: string;
            minisite: {
                minisiteColor: string;
                slogan: string;
            };
            giro: import(".prisma/client").$Enums.Giro;
            location: string;
            profileImage: string;
        };
        minisiteColor: string;
        slides: {
            id: string;
            description: string;
            title: string;
            cta: string;
            imageSrc: string;
            order: number;
        }[];
        slideUsage: {
            used: number;
            limit: number;
        };
        banners: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            empresaId: string | null;
            logo: string;
            banner: string;
            date: Date | null;
            cta_url: string | null;
            cta_button_text: string;
        }[];
    }>;
    setupMinisite(empresaId: string, body: {
        name: string;
        description: string;
        giro: Giro;
        slogan?: string;
        slidesMeta: Array<SlideMeta & {
            imageSrc?: string;
        }>;
        minisiteColor?: string;
    }, files: {
        logo?: Express.Multer.File;
        slides?: (Express.Multer.File | string)[];
    }): Promise<{
        ok: boolean;
    }>;
    bulkUpsertProductsIndexed(empresaId: string, meta: BulkProductMeta[], files: Record<number, {
        main?: Express.Multer.File;
        gallery: Express.Multer.File[];
    }>): Promise<{
        alias: number;
        created: boolean;
        type: string;
        productId?: string;
        message: string;
    }[]>;
    getSpecialities(empresaId: string): Promise<{
        id: string;
        title: string;
        imageUrl: string;
    }[]>;
    registerSpecialities(empresaId: string, body: {
        specialitiesMeta: string;
    }, files: Express.Multer.File[]): Promise<{
        id: string;
        title: string;
        imageUrl: string;
    }[]>;
    private plan;
    private minisite;
    private checkQuota;
    private collect;
    upsertMinisiteVideo(empresaId: string, file: Express.Multer.File): Promise<{
        videoUrl: string;
    }>;
    getMinisiteVideo(minisiteId: string): Promise<{
        videoUrl: string;
    }>;
}
export {};
