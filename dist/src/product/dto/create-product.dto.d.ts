export declare class CreateProductDto {
    name: string;
    description: string;
    lab?: string;
    activeIngredients?: string[];
    features?: string[];
    benefits?: string[];
    problemAddressed?: string;
    imageMain?: string;
    imageGallery?: string[];
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isOnSale?: boolean;
    categoryId: number;
    companyId: string;
}
