import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsNumber, IsUrl } from 'class-validator'
import { Giro, SubscriptionType } from '@prisma/client'

export class UpdateEmpresaDto {
  @ApiProperty() @IsString() userId: string
  @ApiProperty() @IsString() name: string                       // ← requerido

  @ApiPropertyOptional({ enum: Giro })
  @IsEnum(Giro) @IsOptional()
  giro?: Giro

  @ApiPropertyOptional({ enum: SubscriptionType })
  @IsEnum(SubscriptionType) @IsOptional()
  subscription?: SubscriptionType

  @ApiPropertyOptional() @IsUrl() @IsOptional()
  webUrl?: string
  @ApiPropertyOptional() @IsString() @IsOptional()
  bannerImage?: string
  @ApiPropertyOptional() @IsString() @IsOptional()
  logo?: string
  @ApiPropertyOptional() @IsString() @IsOptional()
  title?: string
  @ApiPropertyOptional() @IsString() @IsOptional()
  profileImage?: string
  @ApiPropertyOptional() @IsString() @IsOptional()
  ceo?: string
  @ApiPropertyOptional() @IsString() @IsOptional()
  ceoRole?: string
  @ApiPropertyOptional() @IsString() @IsOptional()
  location?: string
  @ApiPropertyOptional() @IsNumber() @IsOptional()
  followers?: number
  @ApiPropertyOptional() @IsString() @IsOptional()
  dni?: string
}
