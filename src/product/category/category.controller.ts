// src/product/categories/category.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiBody, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger'
import { PartialType } from '@nestjs/mapped-types'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Prisma } from '@prisma/client'

class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

@ApiTags('product-categories')
@Controller('product/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Crear categoría' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({
    description: 'Categoría creada exitosamente',
    schema: {
      example: {
        id: 1,
        name: 'Cosmiatría y Cosmetología',
        bannerImageUrl: 'https://example.com/images/banner.jpg',
        miniSiteImageUrl: 'https://example.com/images/minisite.jpg',
        companyId: 'company-001',
        company: { logo: 'https://example.com/images/logo.png' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos o límite de categorías excedido' })
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto)
  }

  @ApiOperation({ summary: 'Listar todas las categorías' })
  @ApiOkResponse({
    description: 'Listado de todas las categorías',
    schema: {
      example: [
        {
          id: 1,
          name: 'Cosmiatría y Cosmetología',
          bannerImageUrl: 'https://example.com/images/banner.jpg',
          miniSiteImageUrl: 'https://example.com/images/minisite.jpg',
          companyId: 'company-001',
          company: { logo: 'https://example.com/images/logo.png' }
        },
        {
          id: 2,
          name: 'Dermatología Avanzada',
          bannerImageUrl: 'https://example.com/images/banner2.jpg',
          miniSiteImageUrl: 'https://example.com/images/minisite2.jpg',
          companyId: 'company-002',
          company: { logo: 'https://example.com/images/logo2.png' }
        }
      ]
    }
  })
  @Get()
  findAll() {
    return this.categoryService.findAll()
  }

  @ApiOperation({ summary: 'Obtener una categoría por ID (numérico)' })
  @ApiParam({ name: 'id', description: 'ID de la categoría', example: '1' })
  @ApiOkResponse({
    description: 'Detalle de la categoría',
    schema: {
      example: {
        id: 1,
        name: 'Cosmiatría y Cosmetología',
        bannerImageUrl: 'https://example.com/images/banner.jpg',
        miniSiteImageUrl: 'https://example.com/images/minisite.jpg',
        companyId: 'company-001',
        company: { logo: 'https://example.com/images/logo.png' }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id)
  }

  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría', example: '1' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({
    description: 'Categoría actualizada',
    schema: {
      example: {
        id: 1,
        name: 'Cosmiatría Moderna',
        bannerImageUrl: 'https://example.com/images/banner-new.jpg',
        miniSiteImageUrl: 'https://example.com/images/minisite-new.jpg',
        companyId: 'company-001',
        company: { logo: 'https://example.com/images/logo.png' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Prisma.ProductCompanyCategoryUpdateInput
  ) {
    return this.categoryService.update(+id, data)
  }

  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría', example: '1' })
  @ApiOkResponse({
    description: 'Categoría eliminada',
    schema: {
      example: {
        id: 1,
        name: 'Cosmiatría y Cosmetología',
        bannerImageUrl: 'https://example.com/images/banner.jpg',
        miniSiteImageUrl: 'https://example.com/images/minisite.jpg',
        companyId: 'company-001',
        company: { logo: 'https://example.com/images/logo.png' }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id)
  }

  @ApiOperation({ summary: 'Obtener categorías + productos de una empresa' })
  @ApiParam({ name: 'empresaId', description: 'ID de la empresa', example: 'company-001' })
  @ApiOkResponse({
    description: 'Listado de categorías con productos',
    schema: {
      example: [
        {
          id: 1,
          name: 'Cosmiatría y Cosmetología',
          bannerImageUrl: 'https://example.com/images/banner.jpg',
          miniSiteImageUrl: 'https://example.com/images/minisite.jpg',
          companyId: 'company-001',
          products: [
            { id: 'prod-001', name: 'Gel Limpiador Facial' },
            { id: 'prod-002', name: 'Ampolla Rejuvenecedora' }
          ],
          company: { logo: 'https://example.com/images/logo.png' }
        }
      ]
    }
  })
  @Get('by-empresa/:empresaId')
  findAllByEmpresa(@Param('empresaId') empresaId: string) {
    return this.categoryService.findAllByEmpresa(empresaId)
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
    return this.categoryService.findCategoriesByEmpresa(empresaId)
  }
}
