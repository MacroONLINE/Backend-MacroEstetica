import { IsEnum, IsInt, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Profession, ProfessionType } from '@prisma/client';

export class UpdateInstructorDto {
  @ApiProperty({ description: 'Profession of the instructor' })
  @IsEnum(Profession, { message: 'Profession must be a valid enum value' })
  profession!: Profession;

  @ApiProperty({ description: 'Type of the profession' })
  @IsEnum(ProfessionType, { message: 'Type must be either MEDICO or ESTETICISTA' })
  type!: ProfessionType;

  @ApiProperty({ description: 'Description of the instructor' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'Years of experience of the instructor' })
  @IsInt()
  @IsNotEmpty()
  experienceYears!: number;

  @ApiProperty({ description: 'URL of the instructor certifications' })
  @IsString()
  @IsNotEmpty() // Ahora es obligatorio
  certificationsUrl!: string;

  @ApiProperty({ description: 'Status of the instructor' })
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiProperty({ description: 'ID of the associated user' })
  @IsString()
  @IsNotEmpty()
  userId!: string;
}
