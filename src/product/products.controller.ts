import { Controller, Get, Post, Patch, Delete, Param, Body, Query, NotFoundException } from '@nestjs/common';
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
  async findAll(@Query('companyId') companyId: string) {
    if (!companyId) {
      throw new NotFoundException('Debe especificar un ID de empresa');
    }
    return this.productService.findAll(companyId);
  }

  @Get('by-category')
  async findByCategory(
    @Query('companyId') companyId: string,
    @Query('categoryId') categoryId: string, // Recibido como string desde la query
  ) {
    if (!companyId) {
      throw new NotFoundException('Debe especificar un ID de empresa');
    }
    const products = await this.productService.findByCategory(companyId, Number(categoryId)); // Convertir a número
    if (!products || products.length === 0) {
      throw new NotFoundException(`No se encontraron productos para la categoría ${categoryId} en la empresa ${companyId}`);
    }
    return products;
  }
  

  @Get('featured')
  async findFeatured(@Query('companyId') companyId: string) {
    if (!companyId) {
      throw new NotFoundException('Debe especificar un ID de empresa');
    }
    return this.productService.findFeaturedByCompany(companyId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
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
