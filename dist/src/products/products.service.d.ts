import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createProduct(data: CreateProductDto): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        isFeatured: boolean;
        cost: Prisma.Decimal;
        discount: Prisma.Decimal | null;
        productCode: string;
        availableQuantity: number;
    }>;
    getProductsByCompany(companyId: string): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        isFeatured: boolean;
        cost: Prisma.Decimal;
        discount: Prisma.Decimal | null;
        productCode: string;
        availableQuantity: number;
    }[]>;
    updateProduct(productId: number, data: Prisma.ProductUpdateInput): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        isFeatured: boolean;
        cost: Prisma.Decimal;
        discount: Prisma.Decimal | null;
        productCode: string;
        availableQuantity: number;
    }>;
    deleteProduct(productId: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        isFeatured: boolean;
        cost: Prisma.Decimal;
        discount: Prisma.Decimal | null;
        productCode: string;
        availableQuantity: number;
    }>;
    setProductFeatured(productId: number, isFeatured: boolean): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        isFeatured: boolean;
        cost: Prisma.Decimal;
        discount: Prisma.Decimal | null;
        productCode: string;
        availableQuantity: number;
    }>;
    getFeaturedProducts(limit: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        isFeatured: boolean;
        cost: Prisma.Decimal;
        discount: Prisma.Decimal | null;
        productCode: string;
        availableQuantity: number;
    }[]>;
}
