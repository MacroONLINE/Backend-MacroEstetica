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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { ProductService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { ReactionType } from '@prisma/client'
import { AnyFilesInterceptor } from '@nestjs/platform-express'

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado correctamente.' })
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto)
  }

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
    return this.productService.findByCategory(companyId, Number(categoryId), userId)
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

  @Get('highlighted')
  @ApiOperation({ summary: 'Obtener productos highlight de una empresa' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'userId', required: false })
  async findHighlighted(
    @Query('companyId') companyId: string,
    @Query('userId') userId?: string,
  ) {
    if (!companyId) throw new NotFoundException('Debe especificar un ID de empresa')
    return this.productService.findHighlightedByCompany(companyId, userId)
  }

  @Get('offer')
  @ApiOperation({ summary: 'Obtener productos offer de una empresa' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'userId', required: false })
  async findOffer(
    @Query('companyId') companyId: string,
    @Query('userId') userId?: string,
  ) {
    if (!companyId) throw new NotFoundException('Debe especificar un ID de empresa')
    return this.productService.findOfferByCompany(companyId, userId)
  }

  @Get('normal')
  @ApiOperation({ summary: 'Obtener productos normales de una empresa' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'userId', required: false })
  async findNormal(
    @Query('companyId') companyId: string,
    @Query('userId') userId?: string,
  ) {
    if (!companyId) throw new NotFoundException('Debe especificar un ID de empresa')
    return this.productService.findNormalByCompany(companyId, userId)
  }

  @Get('grouped')
  @ApiOperation({ summary: 'Obtener todos los productos agrupados por tipo' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'userId', required: false })
  async findAllGrouped(
    @Query('companyId') companyId: string,
    @Query('userId') userId?: string,
  ) {
    if (!companyId) throw new NotFoundException('Debe especificar un ID de empresa')
    return this.productService.findAllGroupedByType(companyId, userId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'userId', required: false })
  async findById(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ) {
    return this.productService.findById(id, userId)
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({ summary: 'Actualizar un producto con imágenes y tipo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['NORMAL', 'FEATURED', 'HIGHLIGHT', 'OFFER'] },
        name: { type: 'string' },
        description: { type: 'string' },
        lab: { type: 'string' },
        activeIngredients: { type: 'string' },
        features: { type: 'string' },
        benefits: { type: 'string' },
        problemAddressed: { type: 'string' },
        imageMain: { type: 'string' },
        isFeatured: { type: 'string' },
        isBestSeller: { type: 'string' },
        isOnSale: { type: 'string' },
        categoryId: { type: 'string' },
        companyId: { type: 'string' },
        order: { type: 'string' },
        tagline: { type: 'string' },
        highlightFeatures: { type: 'string' },
        highlightDescription: { type: 'string' },
        title: { type: 'string' },
        offerDescription: { type: 'string' },
        main: { type: 'string', format: 'binary' },
        gallery_0: { type: 'string', format: 'binary' },
        gallery_1: { type: 'string', format: 'binary' },
        gallery_2: { type: 'string', format: 'binary' },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() body: Record<string, string>,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.updateWithImages(id, body, files)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string) {
    return this.productService.remove(id)
  }

  @Post(':productId/user/:userId/react')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like/Dislike para un producto' })
  @ApiParam({ name: 'productId' })
  @ApiParam({ name: 'userId' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['type'],
      properties: { type: { type: 'string', enum: ['LIKE', 'DISLIKE'] } },
    },
  })
  async reactToProduct(
    @Param('productId') productId: string,
    @Param('userId') userId: string,
    @Body('type') type: ReactionType,
  ) {
    return this.productService.toggleProductReaction(userId, productId, type || ReactionType.LIKE)
  }

  @Get('user/:userId/wishlist')
  @ApiOperation({ summary: 'Productos a los que el usuario dio like' })
  @ApiParam({ name: 'userId' })
  async getProductWishlist(@Param('userId') userId: string) {
    return this.productService.getLikedProducts(userId)
  }
}
