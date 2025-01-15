import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        categoryId: number;
        companyId: string;
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
    }>;
    findAll(companyId: string): Promise<({
        presentations: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        categoryId: number;
        companyId: string;
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
    })[]>;
    findByCategory(companyId: string, categoryId: string): Promise<({
        presentations: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        categoryId: number;
        companyId: string;
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
    })[]>;
    findFeatured(companyId: string): Promise<({
        presentations: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        categoryId: number;
        companyId: string;
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
    })[]>;
    findById(id: string): Promise<{
        presentations: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        categoryId: number;
        companyId: string;
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
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        presentations: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        categoryId: number;
        companyId: string;
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
