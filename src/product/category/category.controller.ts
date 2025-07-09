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
} from '@nestjs/swagger'
import { PartialType } from '@nestjs/mapped-types'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Prisma } from '@prisma/client'

class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

@ApiTags('product-categories')
@Controller('product/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // src/product/categories/category.controller.ts
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
@ApiCreatedResponse({
  schema: {
    example: {
      id: 1,
      name: 'Cosmiatría y Cosmetología',
      bannerImageUrl: 'https://cdn.example.com/img/banner.jpg',
      miniSiteImageUrl: 'https://cdn.example.com/img/minisite.jpg',
      companyId: 'company-001',
      company: { logo: 'https://cdn.example.com/img/logo.png' },
    },
  },
})
@ApiBadRequestResponse({ description: 'Datos inválidos o cuota excedida' })
@Post()
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'miniSiteImage', maxCount: 1 },
  ]),
)
create(
  @Body() dto: CreateCategoryDto,
  @UploadedFiles()
  files: {
    bannerImage?: Express.Multer.File[]
    miniSiteImage?: Express.Multer.File[]
  },
) {
  return this.categoryService.create(
    dto,
    files.bannerImage?.[0],
    files.miniSiteImage?.[0],
  )
}



  @ApiOperation({ summary: 'Listar todas las categorías' })
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: 1,
          name: 'Cosmiatría y Cosmetología',
          bannerImageUrl: 'https://cdn.example.com/img/banner.jpg',
          miniSiteImageUrl: 'https://cdn.example.com/img/minisite.jpg',
          companyId: 'company-001',
          company: { logo: 'https://cdn.example.com/img/logo.png' },
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.categoryService.findAll()
  }

  @ApiOperation({ summary: 'Obtener una categoría' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    schema: {
      example: {
        id: 1,
        name: 'Cosmiatría y Cosmetología',
        bannerImageUrl: 'https://cdn.example.com/img/banner.jpg',
        miniSiteImageUrl: 'https://cdn.example.com/img/minisite.jpg',
        companyId: 'company-001',
        company: { logo: 'https://cdn.example.com/img/logo.png' },
      },
    },
  })
  @ApiNotFoundResponse()
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
@ApiOkResponse({
  schema: {
    example: {
      id: 1,
      name: 'Cosmiatría Moderna',
      bannerImageUrl: 'https://cdn.example.com/img/banner-new.jpg',
      miniSiteImageUrl: 'https://cdn.example.com/img/minisite-new.jpg',
      companyId: 'company-001',
      company: { logo: 'https://cdn.example.com/img/logo.png' },
    },
  },
})
@Put(':id')
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'miniSiteImage', maxCount: 1 },
  ]),
)
update(
  @Param('id') id: string,
  @Body() data: UpdateCategoryDto,
  @UploadedFiles()
  files: {
    bannerImage?: Express.Multer.File[]
    miniSiteImage?: Express.Multer.File[]
  },
) {
  const patch: Prisma.ProductCompanyCategoryUpdateInput = {
    ...data,
  }
  return this.categoryService.update(
    +id,
    patch,
    files.bannerImage?.[0],
    files.miniSiteImage?.[0],
  )
}

  @ApiOperation({ summary: 'Eliminar categoría' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    schema: {
      example: {
        id: 1,
        name: 'Cosmiatría y Cosmetología',
        bannerImageUrl: 'https://cdn.example.com/img/banner.jpg',
        miniSiteImageUrl: 'https://cdn.example.com/img/minisite.jpg',
        companyId: 'company-001',
        company: { logo: 'https://cdn.example.com/img/logo.png' },
      },
    },
  })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id)
  }

  @ApiOperation({ summary: 'Categorías y productos por empresa' })
  @ApiParam({ name: 'empresaId', example: 'company-001' })
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: 1,
          name: 'Cosmiatría y Cosmetología',
          bannerImageUrl: 'https://cdn.example.com/img/banner.jpg',
          miniSiteImageUrl: 'https://cdn.example.com/img/minisite.jpg',
          products: [
            { id: 'prod-001', name: 'Gel Limpiador Facial' },
            { id: 'prod-002', name: 'Ampolla Rejuvenecedora' },
          ],
          company: { logo: 'https://cdn.example.com/img/logo.png' },
        },
      ],
    },
  })
  @Get('by-empresa/:empresaId')
  findAllByEmpresa(@Param('empresaId') empresaId: string) {
    return this.categoryService.findAllByEmpresa(empresaId)
  }

  @ApiOperation({ summary: 'Categorías básicas por empresa' })
  @ApiParam({ name: 'empresaId', example: 'company-001' })
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: 1,
          name: 'Cosmiatría y Cosmetología',
          bannerImageUrl: 'https://cdn.example.com/img/banner.jpg',
          miniSiteImageUrl: 'https://cdn.example.com/img/minisite.jpg',
        },
      ],
    },
  })
  @Get('empresa/:empresaId/categories')
  findCategoriesByEmpresa(@Param('empresaId') empresaId: string) {
    return this.categoryService.findCategoriesByEmpresa(empresaId)
  }
}
