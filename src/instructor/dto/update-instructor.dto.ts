import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Profession, ProfessionType, Gender } from '@prisma/client';

export class UpdateInstructorDto {
  @ApiProperty({ enum: Profession, required: false })
  @IsEnum(Profession)
  @IsOptional()
  profession?: Profession;

  @ApiProperty({ enum: ProfessionType, required: false })
  @IsEnum(ProfessionType)
  @IsOptional()
  type?: ProfessionType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  experienceYears?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  certificationsUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  empresaId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bannerImage?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  followers?: number;

  @ApiProperty({ enum: Gender, required: false })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  validated?: boolean;
}
