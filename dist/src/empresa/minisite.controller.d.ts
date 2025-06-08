import { FeatureCode } from '@prisma/client';
import { MinisiteService } from './minisite.service';
export declare class MinisiteController {
    private readonly minisite;
    private readonly logger;
    constructor(minisite: MinisiteService);
    getQuotas(empresaId: string): Promise<import("./minisite.service").UsageResponse<any>[]>;
    getQuota(empresaId: string, code: FeatureCode): Promise<import("./minisite.service").UsageResponse<any>>;
    getObjects(empresaId: string): Promise<Record<import(".prisma/client").$Enums.FeatureCode, any[]>>;
    getObjectsByCode(empresaId: string, code: FeatureCode): Promise<{
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
    upsertProduct(empresaId: string, body: any): Promise<{
        id: string;
        name: string;
        description: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean | null;
        activeIngredients: string[];
        benefits: string[];
        categoryId: number | null;
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
        presentations: string[];
    }>;
    upsertBanner(empresaId: string, body: any): Promise<{
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
    }>;
    upsertFeatured(empresaId: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minisiteId: string;
        order: number | null;
        productId: string;
        tagline: string | null;
    }>;
    upsertHighlight(empresaId: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minisiteId: string;
        productId: string;
        highlightFeatures: string[];
        highlightDescription: string | null;
        hoghlightImageUrl: string | null;
    }>;
    getSetup(empresaId: string): Promise<{
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
    setup(empresaId: string, body: any, files: Express.Multer.File[]): Promise<{
        ok: boolean;
    }>;
    bulkProducts(empresaId: string, productsRaw: string, rawFiles: Express.Multer.File[]): Promise<{
        productId: string;
        type: string;
    }[]>;
}
