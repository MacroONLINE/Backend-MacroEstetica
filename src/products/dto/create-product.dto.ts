import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name', description: 'Name of the product' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'A detailed description of the product',
    description: 'Product description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 100.0, description: 'Cost of the product' })
  @IsNumber()
  cost: number;

  @ApiProperty({
    example: 10.0,
    description: 'Discount on the product',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  discount?: number;

  @ApiProperty({ example: 'PROD-001', description: 'Unique product code' })
  @IsString()
  productCode: string;

  @ApiProperty({ example: 50, description: 'Available quantity' })
  @IsNumber()
  availableQuantity: number;

  @ApiProperty({
    example: true,
    description: 'Whether the product is featured',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'URL of the product image',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: 'empresa-id-12345',
    description: 'ID of the associated company',
  })
  @IsString()
  companyId: string;
}
