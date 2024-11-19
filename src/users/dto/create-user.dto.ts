// src/users/dto/create-user.dto.ts

import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  @IsString()
  @MinLength(8)
  password: string;

  // Default role is ESTANDAR unless specified
  @ApiProperty({ enum: Role, description: 'User role', default: Role.ESTANDAR })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.ESTANDAR;
}
