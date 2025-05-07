// src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ProductService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ReactionType } from '@prisma/client'

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado correctamente.' })
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos de una empresa' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiResponse({ status: 200, description: 'Lista de productos.' })
  async findAll(@Query('companyId') companyId: string) {
    if (!companyId) throw new NotFoundException('Debe especificar un ID de empresa')
    return this.productService.findAll(companyId)
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Obtener productos por categoría dentro de una empresa' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'categoryId', required: true })
  @ApiResponse({ status: 200, description: 'Lista filtrada de productos.' })
  async findByCategory(@Query('companyId') companyId: string, @Query('categoryId') categoryId: string) {
    if (!companyId) throw new NotFoundException('Debe especificar un ID de empresa')
    const products = await this.productService.findByCategory(companyId, Number(categoryId))
    if (!products.length)
      throw new NotFoundException(
        `No se encontraron productos para la categoría ${categoryId} en la empresa ${companyId}`,
      )
    return products
  }

  @Get('featured')
  @ApiOperation({ summary: 'Obtener productos destacados de una empresa' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiResponse({ status: 200, description: 'Lista de productos destacados.' })
  async findFeatured(@Query('companyId') companyId: string) {
    if (!companyId) throw new NotFoundException('Debe especificar un ID de empresa')
    return this.productService.findFeaturedByCompany(companyId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Detalle del producto.' })
  async findById(@Param('id') id: string) {
    return this.productService.findById(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado.' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado correctamente.' })
  async remove(@Param('id') id: string) {
    return this.productService.remove(id)
  }

  @Post(':productId/react')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Like/Dislike para un producto',
    description:
      'Si no existe reacción, se crea. Si existe la misma, se elimina. Si existe la opuesta, se cambia.',
  })
  @ApiParam({ name: 'productId', description: 'ID del producto' })
  @ApiBody({
    description: '`type` puede ser "LIKE" o "DISLIKE".',
    required: true,
    schema: {
      type: 'object',
      required: ['type'],
      properties: { type: { type: 'string', enum: ['LIKE', 'DISLIKE'], example: 'LIKE' } },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado del toggle de reacción.',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'usr123' },
        productId: { type: 'string', example: 'prd789' },
        reacted: { type: 'boolean', example: true },
        type: { type: 'string', enum: ['LIKE', 'DISLIKE'], example: 'LIKE' },
      },
    },
  })
  async reactToProduct(
    @Param('productId') productId: string,
    @Body('type') type: ReactionType,
    @Request() req,
  ) {
    return this.productService.toggleProductReaction(
      req.user.userId,
      productId,
      type || ReactionType.LIKE,
    )
  }
}
