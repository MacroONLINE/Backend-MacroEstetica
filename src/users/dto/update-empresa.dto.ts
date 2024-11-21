import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Target } from '@prisma/client';

export class UpdateEmpresaDto {
  @IsString()
  dni!: string; // Obligatorio para Prisma

  @IsString()
  name!: string; // Obligatorio para Prisma

  @IsEnum(Target, { message: 'Target must be either MEDICO or ESTETICISTA' })
  target!: Target; // Obligatorio para Prisma

  @IsOptional()
  @IsString()
  categoryId?: string; // Opcional
}
