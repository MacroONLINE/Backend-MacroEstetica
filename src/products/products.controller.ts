import { Controller, Post, Get, Put, Delete, Patch, Body, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @ApiOperation({ summary: 'Get all products for a company' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully.' })
  @Get('company/:companyId')
  async getProductsByCompany(@Param('companyId') companyId: string) {
    return this.productsService.getProductsByCompany(companyId);
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @Put(':productId')
  async updateProduct(
    @Param('productId') productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(productId, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @Delete(':productId')
  async deleteProduct(@Param('productId') productId: number) {
    return this.productsService.deleteProduct(productId);
  }

  @ApiOperation({ summary: 'Set a product as featured' })
  @ApiResponse({ status: 200, description: 'Product featured status updated.' })
  @Patch(':productId/featured')
  async setProductFeatured(
    @Param('productId') productId: number,
    @Body('isFeatured') isFeatured: boolean,
  ) {
    return this.productsService.setProductFeatured(productId, isFeatured);
  }

  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({ status: 200, description: 'Featured products retrieved successfully.' })
  @Get('featured')
  async getFeaturedProducts(@Query('limit') limit: number = 10) {
    return this.productsService.getFeaturedProducts(limit);
  }
}
