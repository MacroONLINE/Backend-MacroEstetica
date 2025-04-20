import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { UpdateMedicoDto } from '../update-medico.dto'
import { UpdateEmpresaDto } from '../update-empresa.dto'
import { UpdateInstructorDto } from '../update-instructor.dto'

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsString() @IsOptional() firstName?: string
  @ApiPropertyOptional() @IsString() @IsOptional() lastName?: string
  @ApiPropertyOptional() @IsString() @IsOptional() phone?: string
  @ApiPropertyOptional() @IsString() @IsOptional() address?: string
  @ApiPropertyOptional() @IsString() @IsOptional() province?: string
  @ApiPropertyOptional() @IsString() @IsOptional() city?: string
  @ApiPropertyOptional() @IsString() @IsOptional() country?: string
  @ApiPropertyOptional() @IsString() @IsOptional() countryCode?: string
  @ApiPropertyOptional() @IsString() @IsOptional() zipCode?: string

  @ApiPropertyOptional({ type: UpdateMedicoDto })
  @ValidateNested() @Type(() => UpdateMedicoDto) @IsOptional()
  medico?: UpdateMedicoDto

  @ApiPropertyOptional({ type: UpdateEmpresaDto })
  @ValidateNested() @Type(() => UpdateEmpresaDto) @IsOptional()
  empresa?: UpdateEmpresaDto

  @ApiPropertyOptional({ type: UpdateInstructorDto })
  @ValidateNested() @Type(() => UpdateInstructorDto) @IsOptional()
  instructor?: UpdateInstructorDto
}
