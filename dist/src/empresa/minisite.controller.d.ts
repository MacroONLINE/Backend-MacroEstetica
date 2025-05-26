import { FeatureCode } from '@prisma/client';
import { MinisiteService } from './minisite.service';
export declare class MinisiteController {
    private readonly minisite;
    constructor(minisite: MinisiteService);
    getQuotas(empresaId: string): Promise<import("./minisite.service").UsageResponse<any>[]>;
    getQuota(empresaId: string, code: FeatureCode): Promise<import("./minisite.service").UsageResponse<any>>;
    getObjects(empresaId: string): Promise<Record<import(".prisma/client").$Enums.FeatureCode, any[]>>;
    getObjectsByCode(empresaId: string, code: FeatureCode): Promise<any[]>;
    upsertProduct(empresaId: string, body: any): Promise<{
        companyId: string;
        id: string;
        name: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean | null;
        activeIngredients: string[];
        benefits: string[];
        categoryId: number;
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
    }>;
    upsertBanner(empresaId: string, body: any): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        empresaId: string | null;
        banner: string;
        title: string;
        date: Date | null;
        cta_url: string | null;
        cta_button_text: string;
        logo: string;
    }>;
    upsertFeatured(empresaId: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minisiteId: string;
        productId: string;
        order: number | null;
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
    upsertSlide(empresaId: string, body: any): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        minisiteId: string;
        order: number | null;
        cta: string | null;
        imageSrc: string | null;
    }>;
}
