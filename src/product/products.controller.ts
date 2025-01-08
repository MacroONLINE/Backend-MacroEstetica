import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Get('by-category')
  async findByCategory(@Query('categoryId') categoryId: number) {
    return this.productService.findByCategory(categoryId);
  }

  @Get('by-company')
  async findByCompany(@Query('companyId') companyId: string) {
    return this.productService.findByCompany(companyId);
  }

  @Get('featured/by-company')
  async findFeaturedByCompany(@Query('companyId') companyId: string) {
    return this.productService.findFeaturedByCompany(companyId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
