import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { Profession, ProfessionType } from '@prisma/client'

export class UpdateMedicoDto {
  @ApiProperty() @IsString() userId: string

  @ApiPropertyOptional({ enum: Profession })
  @IsEnum(Profession) @IsOptional()
  profession?: Profession

  @ApiPropertyOptional({ enum: ProfessionType })
  @IsEnum(ProfessionType) @IsOptional()
  type?: ProfessionType

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  verification?: string
}
