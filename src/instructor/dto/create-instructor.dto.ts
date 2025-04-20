// create-instructor.dto.ts
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Profession, ProfessionType } from '@prisma/client';

export class CreateInstructorDto {
  @ApiProperty({
    description: 'Profesión del instructor (enum de Prisma)',
    enum: Profession,
  })
  @IsEnum(Profession)
  profession: Profession;

  @ApiProperty({
    description: 'Tipo de profesión del instructor (enum de Prisma)',
    enum: ProfessionType,
  })
  @IsEnum(ProfessionType)
  type: ProfessionType;

  @ApiProperty({
    description: 'Descripción o especialidad del instructor',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Años de experiencia',
    required: false,
    example: 5,
  })
  @IsNumber()
  @IsOptional()
  experienceYears?: number;

  @ApiProperty({
    description: 'URL con las certificaciones del instructor',
    required: false,
  })
  @IsString()
  @IsOptional()
  certificationsUrl?: string;

  @ApiProperty({
    description: 'Estado del instructor (por ejemplo "active" o "inactive")',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'ID del usuario asociado al instructor',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'ID de la empresa para la cual trabaja el instructor',
    required: false,
  })
  @IsString()
  @IsOptional()
  empresaId?: string;

  @ApiProperty({
    description: 'ID de la categoría asociada al instructor',
    required: false,
  })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: 'Título personalizado para el instructor',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'URL para la imagen de banner del instructor',
    required: false,
  })
  @IsString()
  @IsOptional()
  bannerImage?: string;

  @ApiProperty({
    description: 'Número de seguidores del instructor',
    required: false,
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  followers?: number;
}
