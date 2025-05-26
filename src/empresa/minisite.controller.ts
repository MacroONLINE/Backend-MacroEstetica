// src/empresa/minisite.controller.ts
import {
    Controller,
    Get,
    Param,
    ParseEnumPipe,
    Body,
    Put,
  } from '@nestjs/common';
  import {
    ApiBadRequestResponse,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
  } from '@nestjs/swagger';
  import { FeatureCode } from '@prisma/client';
  import { MinisiteService } from './minisite.service';
  import { UsageResponseDto } from './dto/minisite-quota.dto';
  
  @ApiTags('Minisite')
  @Controller('minisite')
  export class MinisiteController {
    constructor(private readonly minisite: MinisiteService) {}
  
    @ApiOperation({
      summary: 'Cuotas y objetos de todos los códigos',
      description:
        'Array con cada `FeatureCode`, su límite (`limit`), lo usado (`used`) y los objetos (`items`).',
    })
    @ApiParam({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' })
    @ApiOkResponse({ type: UsageResponseDto, isArray: true })
    @Get(':empresaId/quotas')
    getQuotas(@Param('empresaId') empresaId: string) {
      return this.minisite.quotas(empresaId);
    }
  
    @ApiOperation({
      summary: 'Cuota y objetos de un código',
      description:
        'Devuelve límite, usado y objetos del `FeatureCode` solicitado.',
    })
    @ApiParam({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' })
    @ApiParam({
      name: 'code',
      enum: FeatureCode,
      example: FeatureCode.BANNER_PRODUCT_SLOTS,
    })
    @ApiOkResponse({ type: UsageResponseDto })
    @ApiBadRequestResponse()
    @Get(':empresaId/quota/:code')
    getQuota(
      @Param('empresaId') empresaId: string,
      @Param('code', new ParseEnumPipe(FeatureCode)) code: FeatureCode,
    ) {
      return this.minisite.quota(empresaId, code);
    }
  
    @ApiOperation({
      summary: 'Objetos de todos los códigos',
      description:
        'Objeto donde cada clave es un `FeatureCode` y su valor el array de objetos.',
    })
    @ApiParam({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' })
    @ApiOkResponse({
      schema: {
        type: 'object',
        additionalProperties: { type: 'array', items: { type: 'object' } },
        example: {
          PRODUCTS_TOTAL: [{ id: 'p1', name: 'Serum AHA' }],
          STATIC_IMAGES_TOTAL: [{ id: 's1', title: 'Promo' }],
        },
      },
    })
    @Get(':empresaId/objects')
    getObjects(@Param('empresaId') empresaId: string) {
      return this.minisite.objects(empresaId);
    }
  
    @ApiOperation({
      summary: 'Objetos de un código',
      description: 'Array de objetos que consumen la cuota indicada.',
    })
    @ApiParam({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' })
    @ApiParam({ name: 'code', enum: FeatureCode, example: FeatureCode.STATIC_IMAGES_TOTAL })
    @ApiOkResponse({
      schema: {
        type: 'array',
        items: { type: 'object' },
        example: [{ id: 'slide1', title: 'Promo', imageSrc: 'https://…' }],
      },
    })
    @Get(':empresaId/objects/:code')
    getObjectsByCode(
      @Param('empresaId') empresaId: string,
      @Param('code', new ParseEnumPipe(FeatureCode)) code: FeatureCode,
    ) {
      return this.minisite.objectsByCode(empresaId, code);
    }
  
    @ApiOperation({ summary: 'Crear o actualizar producto' })
    @ApiParam({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'prod123', description: 'Enviar para actualizar' },
          name: { type: 'string', example: 'Serum Vitamina C' },
          description: { type: 'string', example: 'Potente antioxidante' },
          categoryId: { type: 'integer', example: 5 },
          imageMain: { type: 'string', example: 'https://…' },
        },
        required: ['name', 'categoryId'],
      },
    })
    @Put(':empresaId/product')
    upsertProduct(
      @Param('empresaId') empresaId: string,
      @Body() body: any,
    ) {
      return this.minisite.upsertProduct(empresaId, body);
    }
  
    @ApiOperation({ summary: 'Crear o actualizar banner' })
    @ApiParam({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'ban01' },
          title: { type: 'string', example: 'Navidad' },
          banner: { type: 'string', example: 'https://…/banner.jpg' },
          description: { type: 'string', example: 'Grandes descuentos' },
          cta_button_text: { type: 'string', example: 'Compra ahora' },
          cta_url: { type: 'string', example: 'https://…' },
        },
        required: ['title', 'banner'],
      },
    })
    @Put(':empresaId/banner')
    upsertBanner(
      @Param('empresaId') empresaId: string,
      @Body() body: any,
    ) {
      return this.minisite.upsertBanner(empresaId, body);
    }
  
    @ApiOperation({ summary: 'Crear o actualizar producto destacado' })
    @ApiParam({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'feat01' },
          productId: { type: 'string', example: 'prod123' },
          order: { type: 'integer', example: 1 },
          tagline: { type: 'string', example: 'Top ventas' },
        },
        required: ['productId'],
      },
    })
    @Put(':empresaId/featured')
    upsertFeatured(
      @Param('empresaId') empresaId: string,
      @Body() body: any,
    ) {
      return this.minisite.upsertFeatured(empresaId, body);
    }
  
    @ApiOperation({ summary: 'Crear o actualizar producto highlight' })
    @ApiParam({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'high01' },
          productId: { type: 'string', example: 'prod123' },
          highlightFeatures: {
            type: 'array',
            items: { type: 'string' },
            example: ['Alta concentración', 'Sin parabenos'],
          },
          highlightDescription: { type: 'string', example: 'Nuevo lanzamiento' },
          hoghlightImageUrl: { type: 'string', example: 'https://…/highlight.jpg' },
        },
        required: ['productId', 'highlightFeatures'],
      },
    })
    @Put(':empresaId/highlight')
    upsertHighlight(
      @Param('empresaId') empresaId: string,
      @Body() body: any,
    ) {
      return this.minisite.upsertHighlight(empresaId, body);
    }
  
    @ApiOperation({ summary: 'Crear o actualizar slide' })
    @ApiParam({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'slide01' },
          title: { type: 'string', example: 'Bienvenida' },
          description: { type: 'string', example: 'Conoce nuestra línea' },
          cta: { type: 'string', example: 'Ver más' },
          imageSrc: { type: 'string', example: 'https://…/slide.jpg' },
          order: { type: 'integer', example: 2 },
        },
        required: ['title'],
      },
    })
    @Put(':empresaId/slide')
    upsertSlide(
      @Param('empresaId') empresaId: string,
      @Body() body: any,
    ) {
      return this.minisite.upsertSlide(empresaId, body);
    }
  }
  