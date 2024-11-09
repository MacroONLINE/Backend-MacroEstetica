// src/users/dto/create-user.dto.ts

import { IsString, IsEmail, IsOptional, IsEnum, MinLength, ValidateIf } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  countryCode?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsString()
  @ValidateIf(o => o.role === 'MEDICO')
  verificacion?: string;

  @IsString()
  @ValidateIf(o => o.role === 'EMPRESA')
  dni?: string;
}
