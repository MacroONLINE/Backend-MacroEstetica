import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmpresaCategory, Target } from '@prisma/client';

@ApiTags('empresa')
@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @ApiOperation({ summary: 'Obtener empresas por categoría' })
  @Get('by-category')
async getAllByCategory(@Query('category') category: string) {
  if (!category || !(category in EmpresaCategory)) {
    throw new HttpException('Invalid category', HttpStatus.BAD_REQUEST);
  }
  return this.empresaService.getAllByCategory(category as EmpresaCategory);
}

@Get('by-target')
async getAllByTarget(@Query('target') target: string) {
  if (!target || !(target in Target)) {
    throw new HttpException('Invalid target', HttpStatus.BAD_REQUEST);
  }
  return this.empresaService.getAllByTarget(target as Target);
}

}
