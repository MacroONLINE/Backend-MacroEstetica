import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Giro, SubscriptionType } from '@prisma/client'; // Importa los enums generados por Prisma

export class CreateEmpresaDto {
  @ApiProperty({ description: 'DNI de la empresa', required: false })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiProperty({ description: 'Nombre de la empresa' })
  @IsString()
  name: string;

  @ApiProperty({ enum: Giro, description: 'Giro de la empresa' })
  @IsEnum(Giro, { message: 'Giro must be a valid enum value' })
  giro: Giro;

  @ApiProperty({
    enum: SubscriptionType,
    description: 'Tipo de suscripción de la empresa',
    required: false,
  })
  @IsOptional()
  @IsEnum(SubscriptionType, {
    message: 'Subscription must be a valid enum value',
  })
  subscription?: SubscriptionType;

  @ApiProperty({ description: 'ID del usuario asociado a la empresa' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Imagen del banner de la empresa', required: false })
  @IsOptional()
  @IsString()
  bannerImage?: string;

  @ApiProperty({ description: 'Logo de la empresa', required: false })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ description: 'Título de la empresa', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Imagen de perfil de la empresa', required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ description: 'Nombre del CEO de la empresa', required: false })
  @IsOptional()
  @IsString()
  ceo?: string;

  @ApiProperty({ description: 'Cargo del CEO de la empresa', required: false })
  @IsOptional()
  @IsString()
  ceoRole?: string;

  @ApiProperty({ description: 'Ubicación de la empresa', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Número de seguidores de la empresa', required: false })
  @IsOptional()
  @IsString()
  followers?: number;

  @ApiProperty({ description: 'URL del sitio web de la empresa' })
  @IsOptional()
  @IsString()
  webUrl: string;
}
