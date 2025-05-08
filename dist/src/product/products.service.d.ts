import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ReactionType } from '@prisma/client';
export declare class ProductService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProductDto): Promise<{
        id: string;
        name: string;
        description: string;
        companyId: string;
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
    findAll(companyId: string): Promise<({
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        companyId: string;
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
    })[]>;
    findByCategory(companyId: string, categoryId: number): Promise<({
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        companyId: string;
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
    })[]>;
    findFeaturedByCompany(companyId: string): Promise<({
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        companyId: string;
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
    })[]>;
    findById(id: string): Promise<{
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        companyId: string;
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
    update(id: string, dto: UpdateProductDto): Promise<{
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        companyId: string;
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
    remove(id: string): Promise<{
        message: string;
    }>;
    toggleProductReaction(userId: string, productId: string, type?: ReactionType): Promise<{
        userId: string;
        productId: string;
        reacted: boolean;
        type?: undefined;
    } | {
        userId: string;
        productId: string;
        reacted: boolean;
        type: import(".prisma/client").$Enums.ReactionType;
    }>;
    getLikedProducts(userId: string): Promise<({
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        companyId: string;
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
    })[]>;
}
