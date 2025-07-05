import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma } from '@prisma/client';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(dto: CreateCategoryDto): Promise<{
        company: {
            logo: string;
        };
    } & {
        id: number;
        name: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    findAll(): Promise<({
        company: {
            logo: string;
        };
    } & {
        id: number;
        name: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    })[]>;
    findOne(id: string): Promise<{
        company: {
            logo: string;
        };
    } & {
        id: number;
        name: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    update(id: string, data: Prisma.ProductCompanyCategoryUpdateInput): Promise<{
        company: {
            logo: string;
        };
    } & {
        id: number;
        name: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    remove(id: string): Promise<{
        company: {
            logo: string;
        };
    } & {
        id: number;
        name: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    findAllByEmpresa(empresaId: string): Promise<({
        products: {
            id: string;
            name: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
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
        }[];
        company: {
            logo: string;
        };
    } & {
        id: number;
        name: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    })[]>;
    findCategoriesByEmpresa(empresaId: string): Promise<{
        id: number;
        name: string;
        bannerImageUrl: string;
        miniSiteImageUrl: string;
    }[]>;
}
