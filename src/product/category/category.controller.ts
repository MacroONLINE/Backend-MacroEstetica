// src/product/categories/category.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { PartialType } from '@nestjs/mapped-types'
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Prisma } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

@ApiTags('product-categories')
@Controller('product/categories')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Crear categoría' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'companyId'],
      properties: {
        name: { type: 'string', example: 'Cosmiatría y Cosmetología' },
        companyId: { type: 'string', example: 'company-001' },
        bannerImage: { type: 'string', format: 'binary' },
        miniSiteImage: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Categoría creada correctamente' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body() dto: CreateCategoryDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    const bannerImage =
      files.find(f => ['bannerImage', 'banner', 'banner_file'].includes(f.fieldname))
    const miniSiteImage =
      files.find(f => ['miniSiteImage', 'miniSite', 'minisite', 'mini_site'].includes(f.fieldname))

    return this.categoryService.create(dto, bannerImage, miniSiteImage)
  }

  @ApiOperation({ summary: 'Listar todas las categorías' })
  @ApiOkResponse({ description: 'Lista de categorías' })
  @Get()
  findAll() {
    return this.categoryService.findAll()
  }

  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
  @ApiOkResponse({ description: 'Categoría encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id)
  }

  @ApiOperation({ summary: 'Actualizar categoría' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Cosmiatría Moderna' },
        bannerImage: { type: 'string', format: 'binary' },
        miniSiteImage: { type: 'string', format: 'binary' },
      },
    },
  })
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Param('id') id: string,
    @Body() data: UpdateCategoryDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    const bannerImage =
      files.find(f => ['bannerImage', 'banner', 'banner_file'].includes(f.fieldname))
    const miniSiteImage =
      files.find(f => ['miniSiteImage', 'miniSite', 'minisite', 'mini_site'].includes(f.fieldname))

    const patch: Prisma.ProductCompanyCategoryUpdateInput = { ...data }
    return this.categoryService.update(+id, patch, bannerImage, miniSiteImage)
  }

  @ApiOperation({ summary: 'Eliminar categoría' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
  @ApiOkResponse({ description: 'Categoría eliminada' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id)
  }

  @ApiOperation({ summary: 'Categorías y productos por empresa (con toda la información de productos)' })
  @ApiParam({ name: 'empresaId', example: 'company-001', description: 'ID de la empresa' })
  @ApiOkResponse({ description: 'Lista de categorías con productos completos' })
  @Get('by-empresa/:empresaId')
  findAllByEmpresa(@Param('empresaId') empresaId: string) {
    return this.categoryService.findAllByEmpresa(empresaId)
  }

  @ApiOperation({ summary: 'Categorías básicas por empresa' })
  @ApiParam({ name: 'empresaId', example: 'company-001', description: 'ID de la empresa' })
  @ApiOkResponse({ description: 'Lista básica de categorías' })
  @Get('empresa/:empresaId/categories')
  findCategoriesByEmpresa(@Param('empresaId') empresaId: string) {
    return this.categoryService.findCategoriesByEmpresa(empresaId)
  }
}
