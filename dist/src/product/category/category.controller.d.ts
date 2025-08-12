import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
declare const UpdateCategoryDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCategoryDto>>;
declare class UpdateCategoryDto extends UpdateCategoryDto_base {
}
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(dto: CreateCategoryDto, files?: Record<string, Express.Multer.File[]>): Promise<{
        company: {
            logo: string;
        };
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
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
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
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
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    update(id: string, data: UpdateCategoryDto, files?: Record<string, Express.Multer.File[]>): Promise<{
        company: {
            logo: string;
        };
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    findAllByEmpresa(empresaId: string): Promise<({
        company: {
            logo: string;
        };
        products: ({
            category: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                companyId: string;
                bannerImageUrl: string | null;
                miniSiteImageUrl: string | null;
                footerBanner: string | null;
                iconUrl: string | null;
            };
            highlightProducts: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                minisiteId: string;
                highlightFeatures: string[];
                highlightDescription: string | null;
                hoghlightImageUrl: string | null;
            }[];
            featured: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                minisiteId: string;
                order: number | null;
                tagline: string | null;
            };
            offers: {
                description: string | null;
                title: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                minisiteId: string;
            }[];
            reactions: {
                userId: string;
                type: import(".prisma/client").$Enums.ReactionType;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
            }[];
            company: {
                subscription: import(".prisma/client").$Enums.SubscriptionType | null;
                userId: string;
                title: string | null;
                name: string;
                giro: import(".prisma/client").$Enums.Giro;
                categoria: import(".prisma/client").$Enums.EmpresaCategory;
                webUrl: string | null;
                bannerImage: string | null;
                logo: string | null;
                profileImage: string | null;
                ceo: string | null;
                ceoRole: string | null;
                location: string | null;
                dni: string | null;
                target: import(".prisma/client").$Enums.Target;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                followers: number;
                verified: boolean;
                legalName: string | null;
            };
        } & {
            description: string;
            name: string;
            categoryId: number | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            benefits: string[];
            isFeatured: boolean | null;
            activeIngredients: string[];
            features: string[];
            imageGallery: string[];
            imageMain: string | null;
            isBestSeller: boolean | null;
            isOnSale: boolean | null;
            lab: string | null;
            problemAddressed: string | null;
            presentations: string[];
            companyId: string;
        })[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    })[]>;
    findCategoriesByEmpresa(empresaId: string): Promise<{
        name: string;
        id: number;
        bannerImageUrl: string;
        miniSiteImageUrl: string;
    }[]>;
}
export {};
