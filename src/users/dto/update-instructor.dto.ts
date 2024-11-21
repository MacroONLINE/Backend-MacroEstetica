import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Profession } from '@prisma/client';

export class UpdateInstructorDto {
  @ApiProperty({ description: 'Profession of the instructor' })
  @IsEnum(Profession, { message: 'Profession must be either MEDICO or ESTETICISTA' })
  profession!: Profession;

  @ApiProperty({ description: 'ID of the associated user' })
  @IsString()
  userId!: string;
}
