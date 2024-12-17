import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Enum para SubscriptionType
export enum SubscriptionType {
  ORO = 'ORO',
  PLATA = 'PLATA',
  BRONCE = 'BRONCE',
}

// Enum para Giro
export enum GiroEnum {
  SERVICIOS = 'SERVICIOS',
  PRODUCTOS = 'PRODUCTOS',
  CONSULTORIA = 'CONSULTORIA',
  OTRO = 'OTRO',
}

export class CreateEmpresaDto {
  @ApiProperty({ description: 'DNI de la empresa', required: false })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiProperty({ description: 'Nombre de la empresa' })
  @IsString()
  name: string;

  @ApiProperty({ enum: GiroEnum, description: 'Giro de la empresa' })
  @IsEnum(GiroEnum, { message: 'Giro must be SERVICIOS, PRODUCTOS, CONSULTORIA, or OTRO' })
  giro?: GiroEnum;

  @ApiProperty({
    enum: SubscriptionType,
    description: 'Tipo de suscripción de la empresa',
    required: false,
  })
  @IsOptional()
  @IsEnum(SubscriptionType, {
    message: 'Subscription must be ORO, PLATA, or BRONCE',
  })
  subscription?: SubscriptionType;

  @ApiProperty({ description: 'ID del usuario asociado a la empresa' })
  @IsString()
  userId: string;
}
