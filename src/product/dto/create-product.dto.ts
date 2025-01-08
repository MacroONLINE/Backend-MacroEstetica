import { IsString, IsOptional, IsBoolean, IsArray, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  lab?: string;

  @IsOptional()
  @IsArray()
  activeIngredients?: string[];

  @IsOptional()
  @IsArray()
  features?: string[];

  @IsOptional()
  @IsArray()
  benefits?: string[];

  @IsOptional()
  @IsString()
  problemAddressed?: string;

  @IsOptional()
  @IsString()
  imageMain?: string;

  @IsOptional()
  @IsArray()
  imageGallery?: string[];

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;

  @IsOptional()
  @IsBoolean()
  isOnSale?: boolean;

  @IsInt()
  categoryId: number;

  @IsString()
  companyId: string;
}
