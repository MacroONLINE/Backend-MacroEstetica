import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam } from '@nestjs/swagger';
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
  @Put(':id')
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


  @ApiOperation({ summary: 'Obtener categorías de una empresa (sin productos)' })
  @ApiParam({ name: 'empresaId', description: 'ID de la empresa', example: 'company-001' })
  @ApiOkResponse({
    description: 'Listado de categorías',
    schema: {
      example: [
        {
          id: 1,
          name: 'Cosmiatría y Cosmetología',
          bannerImageUrl: 'https://example.com/images/banner.jpg',
          miniSiteImageUrl: 'https://example.com/images/minisite.jpg'
        },
        {
          id: 2,
          name: 'Dermatología Avanzada',
          bannerImageUrl: 'https://example.com/images/banner2.jpg',
          miniSiteImageUrl: 'https://example.com/images/minisite2.jpg'
        }
      ]
    }
  })
  @Get('empresa/:empresaId/categories')
  findCategoriesByEmpresa(@Param('empresaId') empresaId: string) {
    return this.categoryService.findCategoriesByEmpresa(empresaId);
  }


  
}
