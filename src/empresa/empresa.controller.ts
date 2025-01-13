import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmpresaService } from './empresa.service';
import { Giro, Target } from '@prisma/client';

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
}
