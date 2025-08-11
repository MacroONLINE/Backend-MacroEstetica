import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoryService {
    private readonly prisma;
    private readonly cloud;
    constructor(prisma: PrismaService, cloud: CloudinaryService);
    create(dto: CreateCategoryDto, banner?: Express.Multer.File, minisite?: Express.Multer.File): Promise<{
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
    findOne(id: number): Promise<{
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
    update(id: number, patch: Prisma.ProductCompanyCategoryUpdateInput, banner?: Express.Multer.File, minisite?: Express.Multer.File): Promise<{
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
    remove(id: number): Promise<{
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
            reactions: {
                userId: string;
                type: import(".prisma/client").$Enums.ReactionType;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
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
            offers: {
                description: string | null;
                title: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                minisiteId: string;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                followers: number;
                verified: boolean;
                legalName: string | null;
                target: import(".prisma/client").$Enums.Target;
            };
        } & {
            description: string;
            name: string;
            categoryId: number | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isFeatured: boolean | null;
            companyId: string;
            activeIngredients: string[];
            benefits: string[];
            features: string[];
            imageGallery: string[];
            imageMain: string | null;
            isBestSeller: boolean | null;
            isOnSale: boolean | null;
            lab: string | null;
            problemAddressed: string | null;
            presentations: string[];
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
    private plan;
    private checkQuota;
}
