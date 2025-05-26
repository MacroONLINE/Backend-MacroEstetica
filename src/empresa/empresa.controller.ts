import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiConsumes, ApiBody, ApiParam, ApiResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmpresaService } from './empresa.service';
import { Giro, SubscriptionType, Target } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('empresa')
@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @ApiOperation({ summary: 'Obtener empresas por categoría' })
  @Get('by-category')
  async getAllByCategory(@Query('category') category: string) {
    if (!category || !(category in Giro)) {
      throw new HttpException('Categoría inválida', HttpStatus.BAD_REQUEST);
    }
    return this.empresaService.getAllByCategory(category as Giro);
  }

  @ApiOperation({ summary: 'Obtener empresas por giro' })
  @Get('by-giro')
  async getAllByGiro(@Query('giro') giro: string) {
    if (!giro || !(giro in Giro)) {
      throw new HttpException('Giro inválido', HttpStatus.BAD_REQUEST);
    }
    return this.empresaService.getAllByGiro(giro as Giro);
  }

  @ApiOperation({ summary: 'Obtener empresas por target' })
  @Get('by-target')
  async getAllByTarget(@Query('target') target: string) {
    if (!target || !(target in Target)) {
      throw new HttpException('Target inválido', HttpStatus.BAD_REQUEST);
    }
    return this.empresaService.getAllByTarget(target as Target);
  }

  @ApiOperation({ summary: 'Obtener empresas por giro y target' })
  @Get('by-giro-target')
  async getAllByGiroAndTarget(
    @Query('giro') giro: string,
    @Query('target') target: string,
  ) {
    if (!giro || !(giro in Giro)) {
      throw new HttpException('Giro inválido', HttpStatus.BAD_REQUEST);
    }
    if (!target || !(target in Target)) {
      throw new HttpException('Target inválido', HttpStatus.BAD_REQUEST);
    }
    return this.empresaService.getAllByGiroAndTarget(
      giro as Giro,
      target as Target,
    );
  }

  @ApiOperation({ summary: 'Obtener minisitio de una empresa' })
  @Get(':empresaId/minisite')
  async getMinisiteByEmpresaId(@Param('empresaId') empresaId: string) {
    const data = await this.empresaService.getEmpresaConMinisite(empresaId);
    if (!data) {
      throw new HttpException(
        'Empresa o minisitio no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
    return data;
  }


  @ApiOperation({ summary: 'Subir catálogo (PDF) al minisitio de la empresa' })

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'PDF a subir como catálogo',
        },
      },
    },
  })
  @Put(':empresaId/minisite/catalogue')
  @UseInterceptors(FileInterceptor('file')) 
  async uploadCatalogueFile(
    @Param('empresaId') empresaId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('No se recibió ningún archivo', HttpStatus.BAD_REQUEST);
    }

    if (file.mimetype !== 'application/pdf') {
      throw new HttpException('El archivo debe ser un PDF', HttpStatus.BAD_REQUEST);
    }

    return this.empresaService.uploadCatalogue(empresaId, file);
  }

  @ApiOperation({ summary: 'Obtener plan activo de la empresa por User ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario (empresa) del cual se consulta el plan',
    example: 'cm4sths4i0008g1865nsbbh1l',
  })
  @ApiOkResponse({
    description: 'Plan encontrado y fecha de corte (billingEnd)',
    schema: {
      type: 'object',
      properties: {
        plan: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'ckl8x0q8g000v5185h1a9z4lw',
            },
            type: {
              type: 'string',
              enum: Object.values(SubscriptionType),
              example: 'BASICO',
            },
            description: {
              type: 'string',
              example: 'Plan Básico mensual',
            },
            price: {
              type: 'number',
              example: 100.0,
            },
          },
        },
        interval: {
          type: 'string',
          enum: ['MONTHLY', 'SEMIANNUAL', 'ANNUAL'],
          example: 'MONTHLY',
          description: 'Intervalo de la suscripción',
        },
        billingEnd: {
          type: 'string',
          format: 'date-time',
          example: '2025-06-25T00:00:00.000Z',
          description: 'Fecha en que expira el periodo de facturación actual',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Falta o es inválido el token JWT.',
  })
  @ApiNotFoundResponse({
    description: 'Plan no encontrado para el userId proporcionado.',
  })
  @Get('user/:userId/plan')
  async getPlanByUserId(@Param('userId') userId: string) {
    return this.empresaService.getPlanByUserId(userId);
  }
}
