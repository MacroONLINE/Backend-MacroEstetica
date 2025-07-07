// src/empresa/minisite.controller.ts
import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Body,
  Put,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Logger,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Giro, FeatureCode } from '@prisma/client';
import { BulkProductMeta, MinisiteService } from './minisite.service';
import { UsageResponseDto } from './dto/minisite-quota.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Minisite')
@ApiBearerAuth()          
@UseGuards(JwtAuthGuard)  
@Controller('minisite')
export class MinisiteController {
  private readonly logger = new Logger('MinisiteController');
  constructor(private readonly minisite: MinisiteService) {}

  @ApiOperation({ summary: 'Cuotas y objetos de todos los códigos' })
  @ApiParam({ name: 'empresaId', example: 'company-001' })
  @ApiOkResponse({ type: UsageResponseDto, isArray: true })
  @Get(':empresaId/quotas')
  getQuotas(@Param('empresaId') empresaId: string) {
    return this.minisite.quotas(empresaId);
  }

  @ApiOperation({ summary: 'Cuota y objetos de un código' })
  @ApiParam({ name: 'empresaId', example: 'company-001' })
  @ApiParam({ name: 'code', enum: FeatureCode, example: FeatureCode.BANNER_PRODUCT_SLOTS })
  @ApiOkResponse({ type: UsageResponseDto })
  @ApiBadRequestResponse()
  @Get(':empresaId/quota/:code')
  getQuota(
    @Param('empresaId') empresaId: string,
    @Param('code', new ParseEnumPipe(FeatureCode)) code: FeatureCode,
  ) {
    return this.minisite.quota(empresaId, code);
  }

  @ApiOperation({ summary: 'Objetos de todos los códigos' })
  @ApiParam({ name: 'empresaId', example: 'company-001' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      additionalProperties: { type: 'array', items: { type: 'object' } },
    },
  })
  @Get(':empresaId/objects')
  getObjects(@Param('empresaId') empresaId: string) {
    return this.minisite.objects(empresaId);
  }

  @ApiOperation({ summary: 'Objetos de un código' })
  @ApiParam({ name: 'empresaId', example: 'company-001' })
  @ApiParam({ name: 'code', enum: FeatureCode, example: FeatureCode.STATIC_IMAGES_TOTAL })
  @ApiOkResponse({
    schema: { type: 'array', items: { type: 'object' } },
  })
  @Get(':empresaId/objects/:code')
  getObjectsByCode(
    @Param('empresaId') empresaId: string,
    @Param('code', new ParseEnumPipe(FeatureCode)) code: FeatureCode,
  ) {
    return this.minisite.objectsByCode(empresaId, code);
  }

 


  @ApiOperation({ summary: 'Obtener configuración general del minisite' })
  @ApiParam({ name: 'empresaId', example: 'company-001' })
  @ApiOkResponse({
    description: 'Datos del minisite, banners y uso de slots',
    schema: {
      example: {
        company: {
          name: 'Empresa PRUEBA CA',
          location: null,
          title: null,
          giro: 'EMPRESA_PROFESIONAL_PERFIL',
          profileImage: 'https://res.cloudinary.com/dwcrzwawj/image/upload/v1735332034/11_que_es_un_cosmetico_lider_uy08ij.jpg',
          minisite: {
            minisiteColor: '#0000FF',
            slogan: 'Lo esencial al mejor precio'
          }
        },
        minisiteColor: '#0000FF',
        slides: [
          {
            id: 'slide-001',
            title: 'Bienvenido a Aromaterapia',
            imageSrc: 'https://res.cloudinary.com/dwcrzwawj/image/upload/v1735332035/12_apartologia_peque_gkmvrb.png',
            order: 1
          },
          {
            id: 'slide-002',
            title: 'Productos Destacados',
            imageSrc: 'https://res.cloudinary.com/dwcrzwawj/image/upload/v1735332034/11_que_es_un_cosmetico_lider_uy08ij.jpg',
            order: 2
          }
        ],
        slideUsage: {
          used: 2,
          limit: 6
        },
        banners: [
          {
            id: 'banner-002',
            banner: 'https://example.com/banner2.jpg',
            title: 'Nuevo Taller',
            description: 'Aprende de los mejores instructores',
            date: '2025-01-06T00:42:42.213Z',
            cta_url: 'http://example.com/cta2',
            cta_button_text: 'Inscríbete',
            logo: 'https://example.com/logo2.png',
            empresaId: 'company-001',
            createdAt: '2025-01-06T00:42:42.213Z',
            updatedAt: '2025-01-06T00:42:42.213Z'
          }
        ]
      }
    }
  })
  @Get(':empresaId/setup')
  getSetup(@Param('empresaId') empresaId: string) {
    this.logger.verbose(`GET /minisite/${empresaId}/setup`);
    return this.minisite.getMinisiteSetup(empresaId);
  }

  @ApiOperation({ summary: 'Configurar datos generales, color, logo y slides' })
@ApiConsumes('multipart/form-data')
@ApiParam({ name: 'empresaId', example: 'company-001' })
@ApiBody({
  schema: {
    type: 'object',
    required: ['name', 'description', 'giro', 'slidesMeta'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      giro: { type: 'string', enum: Object.values(Giro) },
      slogan: { type: 'string' },
      minisiteColor: { type: 'string' },
      slidesMeta: { type: 'string' },
      logo: { type: 'string', format: 'binary' },
      slides: { type: 'array', items: { type: 'string', format: 'binary' } },
    },
  },
})
// minisite.controller.ts  – solo este handler cambia
// minisite.controller.ts – método setup

// src/empresa/minisite.controller.ts
@UseInterceptors(AnyFilesInterceptor())
@Put(':empresaId/setup')
async setup(
  @Param('empresaId') empresaId: string,
  @Body() body: any,
  @UploadedFiles() files: Express.Multer.File[],
) {
  const logo = files.find(f => f.fieldname === 'logo')

  const slideFiles = files.filter(f => f.fieldname === 'slides')
  slideFiles.forEach((f, i) =>
    this.logger.debug(`slideFile[${i}]=${f.originalname}`),
  )

  const slidesMeta = body.slidesMeta ? JSON.parse(body.slidesMeta) : []
  const slides: (Express.Multer.File | string)[] = slidesMeta.map((m, i) =>
    slideFiles[i] ?? m.imageSrc ?? '',
  )
  slides.forEach((s, i) =>
    this.logger.debug(
      `slide[${i}]=${typeof s === 'string' ? s : s.originalname}`,
    ),
  )

  this.logger.debug(`logo=${logo?.originalname || '∅'} totalSlides=${slides.length}`)

  return this.minisite.setupMinisite(
    empresaId,
    {
      name: body.name,
      description: body.description,
      giro: body.giro as Giro,
      slogan: body.slogan,
      slidesMeta,
      minisiteColor: body.minisiteColor,
    },
    { logo, slides },
  )
}








  @ApiOperation({
    summary: 'Bulk-upsert de productos (NORMAL, FEATURED, HIGHLIGHT u OFFER)',
    description: `
Envía **multipart/form-data** con:

- **products**: string (JSON.stringify de un array con la metadata – misma posición que los archivos).
- Archivos nombrados **main_i** (imagen principal) y **gallery_i** (galería) por índice **i**.

### Ejemplos de objetos **products**

\`\`\`json
[
  {
    "name": "Gel Limpiador Facial",
    "type": "NORMAL",
    "description": "Limpieza profunda sin resecar la piel",
    "categoryId": 11,
    "activeIngredients": ["Ácido salicílico 2 %", "Zinc PCA"],
    "benefits": ["Regula sebo", "Desobstruye poros"],
    "features": ["pH 5.5", "Sin sulfatos", "No comedogénico"],
    "isFeatured": false,
    "isBestSeller": true,
    "isOnSale": false,
    "presentations": "50 ml, 100 ml, 250 ml",
    "lab": "DermaCare Labs",
    "problemAddressed": "Acné leve"
  },
  {
    "name": "Ampolla Rejuvenecedora",
    "type": "FEATURED",
    "order": 1,
    "tagline": "Efecto flash inmediato",
    "description": "Con péptidos y factor de crecimiento",
    "categoryId": 12,
    "activeIngredients": ["Péptidos", "Ácido hialurónico"],
    "benefits": ["Tensa", "Ilumina"],
    "features": ["Uso profesional"],
    "lab": "BeautyScience"
  },
  {
    "name": "Crema Reparadora Noche",
    "type": "HIGHLIGHT",
    "highlightFeatures": ["Retinol 0.3 %", "Ceramidas", "Niacinamida"],
    "highlightDescription": "Renueva barrera cutánea mientras duermes",
    "categoryId": 13,
    "description": "Nutrición intensiva"
  },
  {
    "name": "Serum Vitamina C 20 %",
    "type": "OFFER",
    "title": "2×1 de lanzamiento",
    "offerDescription": "Promoción válida hasta el 31/12",
    "categoryId": 14,
    "description": "Antioxidante de alta potencia"
  }
]
\`\`\`
    `,
  })
  @ApiConsumes('multipart/form-data')
  @ApiConflictResponse({
    description: 'Se superó el cupo permitido para el plan (PRODUCTS_TOTAL, FEATURED_PRODUCTS_TOTAL, etc.)',
  })
  @ApiUnprocessableEntityResponse({
    description: 'La categoría indicada ya contiene 12 productos',
  })
  @ApiParam({ name: 'empresaId', example: 'company-001' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['products'],
      properties: {
        products: {
          type: 'string',
          description: 'JSON array con la metadata de los productos en orden',
        },
        main_0:    { type: 'string', format: 'binary', description: 'Imagen principal del producto 0' },
        gallery_0: { type: 'array',  items: { type: 'string', format: 'binary' }, description: 'Galería del producto 0' },
        main_1:    { type: 'string', format: 'binary', description: 'Imagen principal del producto 1' },
        gallery_1: { type: 'array',  items: { type: 'string', format: 'binary' }, description: 'Galería del producto 1' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Límite por categoría o cupo general excedido' })
  @ApiOkResponse({
    description: 'Lista con IDs y tipos de los productos procesados',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
          type: { type: 'string', enum: ['NORMAL', 'FEATURED', 'HIGHLIGHT', 'OFFER'] },
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  @Put(':empresaId/products')
  async bulkProducts(
    @Param('empresaId') empresaId: string,
    @Body('products') productsRaw: string,
    @UploadedFiles() rawFiles: Express.Multer.File[],
  ) {
    const meta = JSON.parse(productsRaw ?? '[]') as BulkProductMeta[];
    const buckets: Record<number, { main?: Express.Multer.File; gallery: Express.Multer.File[] }> = {};
    for (const f of rawFiles) {
      const m = /^(.+)_(\d+)$/.exec(f.fieldname);
      if (!m) continue;
      const [, key, idxStr] = m;
      const idx = Number(idxStr);
      if (!buckets[idx]) buckets[idx] = { gallery: [] };
      if (key === 'main') buckets[idx].main = f;
      if (key === 'gallery') buckets[idx].gallery.push(f);
    }
    return this.minisite.bulkUpsertProductsIndexed(empresaId, meta, buckets);
  }

  


  @ApiOperation({ summary: 'Obtener specialities del minisite' })
  @ApiParam({ name: 'empresaId', example: 'company-001' })
  @ApiOkResponse({
    description: 'Lista de specialities guardadas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          imageUrl: { type: 'string' },
        },
      },
    },
  })
  @Get(':empresaId/specialities')
  getSpecialities(@Param('empresaId') empresaId: string) {
    return this.minisite.getSpecialities(empresaId);
  }

  @ApiOperation({ summary: 'Registrar specialities (reemplaza todas)' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'empresaId', example: 'company-001' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['specialitiesMeta'],
      properties: {
        specialitiesMeta: {
          type: 'string',
          description: 'JSON array de objetos con { "title": string } en el mismo orden que las imágenes',
          example: JSON.stringify([
            { title: 'Nutrición integral' },
            { title: 'Alimentación clínica' }
          ]),
        },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Archivos de imagen para cada speciality, en el mismo orden',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Lista de specialities registradas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          imageUrl: { type: 'string' },
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  @Put(':empresaId/specialities')
  registerSpecialities(
    @Param('empresaId') empresaId: string,
    @Body('specialitiesMeta') specialitiesMeta: string,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.minisite.registerSpecialities(
      empresaId,
      { specialitiesMeta },
      images,
    );
  }


  
@ApiOperation({
  summary: 'Subir / actualizar video de presentación del minisite',
  description: 'Sobrescribe la URL de video almacenada en el minisite con el nuevo archivo subido.',
})
@ApiConsumes('multipart/form-data')
@ApiParam({ name: 'empresaId', example: 'company-001' })
@ApiBody({
  schema: {
    type: 'object',
    required: ['video'],
    properties: {
      video: { type: 'string', format: 'binary', description: 'Archivo de video MP4/WEBM' },
    },
  },
})
@ApiOkResponse({
  description: 'URL del video guardado',
  schema: { type: 'object', properties: { videoUrl: { type: 'string' } } },
})
@UseInterceptors(FileInterceptor('video'))
@Put(':empresaId/video')
async uploadVideo(
  @Param('empresaId') empresaId: string,
  @UploadedFile() video: Express.Multer.File,
) {
  return this.minisite.upsertMinisiteVideo(empresaId, video)
}



@Get(':minisiteId/video')
@ApiOperation({ summary: 'Obtener URL de video del minisite' })
@ApiParam({ name: 'minisiteId', description: 'ID del minisite', example: 'ms_01HTX3C21TEY5Q9Y25E4ARQ1KZ' })
@ApiResponse({
  status: 200,
  schema: {
    example: { videoUrl: 'https://cdn.example.com/videos/intro.mp4' },
  },
})
@ApiResponse({ status: 404, description: 'Minisite no encontrado o sin video' })
async getVideo(@Param('minisiteId') minisiteId: string) {
  return this.minisite.getMinisiteVideo(minisiteId)
}










}

