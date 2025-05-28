// src/empresa/empresa.controller.ts
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
import {
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EmpresaService } from './empresa.service';
import { Giro, SubscriptionType, Target } from '@prisma/client';

@ApiTags('empresa')
@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  /* ───────── filtros básicos ───────── */

  @ApiOperation({ summary: 'Obtener empresas por categoría' })
  @ApiBadRequestResponse()
  @Get('by-category')
  async getAllByCategory(@Query('category') category: string) {
    if (!category || !(category in Giro)) {
      throw new HttpException('Categoría inválida', HttpStatus.BAD_REQUEST);
    }
    return this.empresaService.getAllByCategory(category as Giro);
  }

  @ApiOperation({ summary: 'Obtener empresas por giro' })
  @ApiBadRequestResponse()
  @Get('by-giro')
  async getAllByGiro(@Query('giro') giro: string) {
    if (!giro || !(giro in Giro)) {
      throw new HttpException('Giro inválido', HttpStatus.BAD_REQUEST);
    }
    return this.empresaService.getAllByGiro(giro as Giro);
  }

  @ApiOperation({ summary: 'Obtener empresas por target' })
  @ApiBadRequestResponse()
  @Get('by-target')
  async getAllByTarget(@Query('target') target: string) {
    if (!target || !(target in Target)) {
      throw new HttpException('Target inválido', HttpStatus.BAD_REQUEST);
    }
    return this.empresaService.getAllByTarget(target as Target);
  }

  @ApiOperation({ summary: 'Obtener empresas por giro y target' })
  @ApiBadRequestResponse()
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

  /* ───────── lectura de minisite ───────── */

  @ApiOperation({ summary: 'Obtener minisitio completo de una empresa' })
  @ApiParam({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' })
  @ApiNotFoundResponse({ description: 'Empresa o minisitio no encontrado' })
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

  /* ───────── subir catálogo PDF ───────── */

  @ApiOperation({ summary: 'Subir catálogo (PDF) al minisite de la empresa' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo PDF',
        },
      },
      required: ['file'],
    },
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Catálogo subido correctamente' },
        catalogueUrl: { type: 'string', example: 'https://res.cloudinary…/cat.pdf' },
      },
    },
  })
  @ApiBadRequestResponse()
  @Put(':empresaId/minisite/catalogue')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCatalogueFile(
    @Param('empresaId') empresaId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException(
        'No se recibió ningún archivo',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (file.mimetype !== 'application/pdf') {
      throw new HttpException('El archivo debe ser un PDF', HttpStatus.BAD_REQUEST);
    }
    return this.empresaService.uploadCatalogue(empresaId, file);
  }

  /* ───────── plan por userId ───────── */

  @ApiOperation({
    summary: 'Obtener plan activo de la empresa (por userId)',
    description:
      'Si el usuario canceló la suscripción pero el periodo pagado no ha vencido, `active` seguirá en `true`.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario empresa',
    example: 'cm4sths4i0008g1865nsbbh1l',
  })
  @ApiOkResponse({
    description: 'Plan encontrado',
    schema: {
      type: 'object',
      properties: {
        plan: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: {
              type: 'string',
              enum: Object.values(SubscriptionType),
            },
            description: { type: 'string' },
            price: { type: 'number' },
          },
        },
        interval: {
          type: 'string',
          enum: ['MONTHLY', 'SEMIANNUAL', 'ANNUAL'],
        },
        billingEnd: {
          type: 'string',
          format: 'date-time',
        },
        active: {
          type: 'boolean',
          example: true,
          description:
            'TRUE si la fecha actual es menor o igual a billingEnd, incluso si la suscripción fue cancelada',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido o ausente' })
  @ApiNotFoundResponse({ description: 'Plan no encontrado' })
  @Get('user/:userId/plan')
  async getPlanByUserId(@Param('userId') userId: string) {
    return this.empresaService.getPlanByUserId(userId);
  }


  @ApiOperation({
    summary: 'Verificar empresa',
    description: 'Marca la empresa como verificada (`verified = true`).',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)                // ← opcional: requiere token
  @ApiParam({
    name: 'empresaId',
    example: 'ckqs889df0000g411o2o1p4sa',
    description: 'ID de la empresa a verificar',
  })
  @ApiOkResponse({
    description: 'Empresa verificada',
    schema: {
      type: 'object',
      properties: {
        id      : { type: 'string', example: 'ckqs889df0000g411o2o1p4sa' },
        name    : { type: 'string', example: 'DermaCorp' },
        verified: { type: 'boolean', example: true },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Empresa no encontrada' })
  @Put(':empresaId/verify')
  verifyEmpresa(@Param('empresaId') empresaId: string) {
    return this.empresaService.verifyEmpresa(empresaId);
  }
}
