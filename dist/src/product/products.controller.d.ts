import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ReactionType } from '@prisma/client';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(dto: CreateProductDto): Promise<{
        description: string;
        name: string;
        categoryId: number | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean | null;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
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
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
    })[]>;
    findByCategory(companyId: string, categoryId: string, userId?: string): Promise<({
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
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
    })[]>;
    findFeatured(companyId: string, userId?: string): Promise<({
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
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
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
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
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
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
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
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
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
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
    }[]>;
}
