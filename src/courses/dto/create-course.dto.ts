import { IsString, IsOptional, IsEnum, IsNumber, Min, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ example: 'Curso de Node.js', description: 'Nombre del curso' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Aprende Node.js desde cero', description: 'Descripción del curso', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 100.0, description: 'Costo del curso' })
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiProperty({ example: 10.0, description: 'Descuento aplicado al curso', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiProperty({ enum: CourseLevel, description: 'Nivel del curso' })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ example: true, description: 'Indica si el curso está destacado', required: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
