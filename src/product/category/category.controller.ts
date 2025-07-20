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
import { FileFieldsInterceptor } from '@nestjs/platform-express'
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
        miniSiteImage: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'miniSiteImage', maxCount: 1 }]),
  )
  create(
    @Body() dto: CreateCategoryDto,
    @UploadedFiles() files: Record<string, Express.Multer.File[]> = {},
  ) {
    const image = files.miniSiteImage?.[0]
    return this.categoryService.create(dto, image)
  }

  @ApiOperation({ summary: 'Listar todas las categorías' })
  @ApiOkResponse()
  @Get()
  findAll() {
    return this.categoryService.findAll()
  }

  @ApiOperation({ summary: 'Obtener una categoría' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNotFoundResponse()
  @ApiOkResponse()
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
        miniSiteImage: { type: 'string', format: 'binary' },
      },
    },
  })
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'miniSiteImage', maxCount: 1 }]),
  )
  update(
    @Param('id') id: string,
    @Body() data: UpdateCategoryDto,
    @UploadedFiles() files: Record<string, Express.Multer.File[]> = {},
  ) {
    const patch: Prisma.ProductCompanyCategoryUpdateInput = { ...data }
    const image = files.miniSiteImage?.[0]
    return this.categoryService.update(+id, patch, image)
  }

  @ApiOperation({ summary: 'Eliminar categoría' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id)
  }

  @ApiOperation({ summary: 'Categorías y productos por empresa' })
  @ApiParam({ name: 'empresaId', example: 'company-001' })
  @Get('by-empresa/:empresaId')
  findAllByEmpresa(@Param('empresaId') empresaId: string) {
    return this.categoryService.findAllByEmpresa(empresaId)
  }

  @ApiOperation({ summary: 'Categorías básicas por empresa' })
  @ApiParam({ name: 'empresaId', example: 'company-001' })
  @Get('empresa/:empresaId/categories')
  findCategoriesByEmpresa(@Param('empresaId') empresaId: string) {
    return this.categoryService.findCategoriesByEmpresa(empresaId)
  }
}
