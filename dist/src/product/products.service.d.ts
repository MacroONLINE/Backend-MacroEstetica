import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ReactionType } from '@prisma/client';
export declare class ProductService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProductDto): Promise<{
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
    }>;
    findAll(companyId: string, userId?: string): Promise<({
        presentations: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
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
    })[]>;
    findByCategory(companyId: string, categoryId: number, userId?: string): Promise<({
        presentations: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
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
    })[]>;
    findFeaturedByCompany(companyId: string, userId?: string): Promise<({
        presentations: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
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
    })[]>;
    findById(id: string, userId?: string): Promise<({
        presentations: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
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
    }) | {
        liked: boolean;
        presentations: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
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
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        presentations: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
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
    getLikedProducts(userId: string): Promise<{
        liked: boolean;
        presentations: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
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
    }[]>;
    private getLikedProductIds;
}
