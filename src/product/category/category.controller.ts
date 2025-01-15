import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma } from '@prisma/client';

@ApiTags('product-categories')
@Controller('product/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Crear categoría' })
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @ApiOperation({ summary: 'Listar todas las categorías' })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una categoría por ID (numérico)' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar una categoría' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.ProductCompanyCategoryUpdateInput) {
    return this.categoryService.update(+id, data);
  }

  @ApiOperation({ summary: 'Eliminar una categoría' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }

  /**
   * Nuevo endpoint: Obtener todas las categorías de una empresa,
   * junto con los productos asociados.
   */
  @ApiOperation({ summary: 'Obtener categorías + productos de una empresa' })
  @Get('by-empresa/:empresaId')
  findAllByEmpresa(@Param('empresaId') empresaId: string) {
    return this.categoryService.findAllByEmpresa(empresaId);
  }
}
