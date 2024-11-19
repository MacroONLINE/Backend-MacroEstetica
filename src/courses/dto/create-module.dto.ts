import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({ example: 'Introducción a Node.js', description: 'Descripción del módulo' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'claseId123', description: 'ID del curso asociado' })
  @IsString()
  courseId: string;
}
