import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator'
import { Profession, ProfessionType, Gender } from '@prisma/client'

export class UpdateInstructorDto {
  @ApiProperty() @IsString() userId: string

  @ApiPropertyOptional({ enum: Profession })
  @IsEnum(Profession) @IsOptional()
  profession?: Profession

  @ApiPropertyOptional({ enum: ProfessionType })
  @IsEnum(ProfessionType) @IsOptional()
  type?: ProfessionType

  @ApiPropertyOptional() @IsString() @IsOptional()
  description?: string

  @ApiPropertyOptional() @IsNumber() @IsOptional()
  experienceYears?: number

  @ApiPropertyOptional() @IsString() @IsOptional()
  certificationsUrl?: string

  @ApiPropertyOptional() @IsString() @IsOptional()
  status?: string

  @ApiPropertyOptional() @IsString() @IsOptional()
  empresaId?: string

  @ApiPropertyOptional() @IsString() @IsOptional()
  categoryId?: string

  @ApiPropertyOptional() @IsString() @IsOptional()
  title?: string

  @ApiPropertyOptional() @IsString() @IsOptional()
  bannerImage?: string

  @ApiPropertyOptional() @IsNumber() @IsOptional()
  followers?: number

  @ApiPropertyOptional({ enum: Gender })
  @IsEnum(Gender) @IsOptional()
  gender?: Gender

  @ApiPropertyOptional() @IsBoolean() @IsOptional()
  validated?: boolean
}
