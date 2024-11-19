import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({ example: 'Clase 1: Configuración inicial', description: 'Descripción de la clase' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'moduloId123', description: 'ID del módulo asociado' })
  @IsString()
  moduleId: string;
}
