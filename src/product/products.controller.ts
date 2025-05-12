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
} from '@nestjs/swagger'
import { ReactionType } from '@prisma/client'

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /* ──────────────── CREAR ──────────────── */

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado correctamente.' })
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto)
  }

  /* ──────────────── LISTADOS ──────────────── */

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos de una empresa' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'userId', required: false })
  async findAll(
    @Query('companyId') companyId: string,
    @Query('userId') userId?: string,
  ) {
    if (!companyId) throw new NotFoundException('Debe especificar un ID de empresa')
    return this.productService.findAll(companyId, userId)
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Obtener productos por categoría dentro de una empresa' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'categoryId', required: true })
  @ApiQuery({ name: 'userId', required: false })
  async findByCategory(
    @Query('companyId') companyId: string,
    @Query('categoryId') categoryId: string,
    @Query('userId') userId?: string,
  ) {
    if (!companyId) throw new NotFoundException('Debe especificar un ID de empresa')
    const products = await this.productService.findByCategory(companyId, Number(categoryId), userId)
    if (!products.length) {
      throw new NotFoundException(
        `No se encontraron productos para la categoría ${categoryId} en la empresa ${companyId}`,
      )
    }
    return products
  }

  @Get('featured')
  @ApiOperation({ summary: 'Obtener productos destacados de una empresa' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'userId', required: false })
  async findFeatured(
    @Query('companyId') companyId: string,
    @Query('userId') userId?: string,
  ) {
    if (!companyId) throw new NotFoundException('Debe especificar un ID de empresa')
    return this.productService.findFeaturedByCompany(companyId, userId)
  }

  /* ──────────────── DETALLE ──────────────── */

@Get(':id')
@ApiOperation({ summary: 'Obtener un producto por ID' })
@ApiParam({ name: 'id', description: 'ID del producto' })
@ApiQuery({ name: 'userId', required: false, description: 'ID del usuario para saber si lo ha dado like' })
@ApiResponse({ status: 200, description: 'Detalle del producto, con campo liked opcional' })
async findById(
  @Param('id') id: string,
  @Query('userId') userId?: string,
) {
  return this.productService.findById(id, userId)
}


  /* ──────────────── ACTUALIZAR / ELIMINAR ──────────────── */

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  async remove(@Param('id') id: string) {
    return this.productService.remove(id)
  }

  /* ──────────────── REACCIONES ──────────────── */

  @Post(':productId/user/:userId/react')
  @ApiOperation({
    summary: 'Like/Dislike para un producto',
    description:
      'Si no existe reacción, se crea. Si existe la misma, se elimina. Si existe la opuesta, se cambia.',
  })
  @ApiParam({ name: 'productId', description: 'ID del producto' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['type'],
      properties: {
        type: { type: 'string', enum: ['LIKE', 'DISLIKE'], example: 'LIKE' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Reacción procesada.' })
  async reactToProduct(
    @Param('productId') productId: string,
    @Param('userId') userId: string,
    @Body('type') type: ReactionType,
  ) {
    return this.productService.toggleProductReaction(
      userId,
      productId,
      type || ReactionType.LIKE,
    )
  }

  /* ──────────────── WISHLIST ──────────────── */

  @Get('user/:userId/wishlist')
  @ApiOperation({ summary: 'Productos a los que el usuario dio like (wishlist)' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  async getProductWishlist(@Param('userId') userId: string) {
    return this.productService.getLikedProducts(userId)
  }


}
