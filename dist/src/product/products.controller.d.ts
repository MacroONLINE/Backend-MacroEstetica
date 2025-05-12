import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ReactionType } from '@prisma/client';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(dto: CreateProductDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: number;
        isFeatured: boolean | null;
        name: string;
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
            id: number;
            description: string | null;
            price: number | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: number;
        isFeatured: boolean | null;
        name: string;
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
    findByCategory(companyId: string, categoryId: string, userId?: string): Promise<({
        presentations: {
            id: number;
            description: string | null;
            price: number | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: number;
        isFeatured: boolean | null;
        name: string;
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
    findFeatured(companyId: string, userId?: string): Promise<({
        presentations: {
            id: number;
            description: string | null;
            price: number | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: number;
        isFeatured: boolean | null;
        name: string;
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
            id: number;
            description: string | null;
            price: number | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: number;
        isFeatured: boolean | null;
        name: string;
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
            id: number;
            description: string | null;
            price: number | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: number;
        isFeatured: boolean | null;
        name: string;
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
            id: number;
            description: string | null;
            price: number | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: number;
        isFeatured: boolean | null;
        name: string;
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
    reactToProduct(productId: string, userId: string, type: ReactionType): Promise<{
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
    getProductWishlist(userId: string): Promise<{
        liked: boolean;
        presentations: {
            id: number;
            description: string | null;
            price: number | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: number;
        isFeatured: boolean | null;
        name: string;
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
}
