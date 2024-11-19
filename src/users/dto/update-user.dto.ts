// src/users/dto/update-user.dto.ts

import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  ValidateIf,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {

  @ApiProperty({ description: 'User ID' }) 
  @IsString()
  id: string;

  @ApiPropertyOptional({ example: 'Ana', description: 'First name of the user' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Gonzalez', description: 'Last name of the user' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: '555-1234', description: 'User phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Main St', description: 'User address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Some Province', description: 'User province' })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiPropertyOptional({ example: 'Some City', description: 'User city' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Mexico', description: 'User country' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 'MX', description: 'Country code' })
  @IsString()
  @IsOptional()
  countryCode?: string;

  @ApiPropertyOptional({ example: '12345', description: 'User zip code' })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiPropertyOptional({ example: 'http://example.com/verification', description: 'Verification URL for MEDICO role' })
  @IsString()
  @ValidateIf(o => o.role === 'MEDICO')
  verification?: string;

  @ApiPropertyOptional({ example: '123456789', description: 'DNI for EMPRESA role' })
  @IsString()
  @ValidateIf(o => o.role === 'EMPRESA')
  dni?: string;

  @ApiPropertyOptional({ example: 'Experienced instructor bio', description: 'Bio for INSTRUCTOR role' })
@IsString()
@ValidateIf(o => o.role === 'INSTRUCTOR')
bio?: string;


  @ApiPropertyOptional({ example: true, description: 'Subscribe to newsletter' })
  @IsBoolean()
  @IsOptional()
  newsletter?: boolean;

  @ApiPropertyOptional({ enum: Role, description: 'User role' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
