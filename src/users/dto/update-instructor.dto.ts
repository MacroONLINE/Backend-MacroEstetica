import { IsEnum } from 'class-validator';
import { Profession } from '@prisma/client';

export class UpdateInstructorDto {
  @IsEnum(Profession, { message: 'Profession must be either MEDICO or ESTETICISTA' })
  profession!: Profession; // Obligatorio para Prisma
}
