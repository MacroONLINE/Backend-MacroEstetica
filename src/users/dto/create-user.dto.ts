import { IsString, IsEmail, IsOptional, IsEnum, MinLength, ValidateIf } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 'Ana', description: 'First name of the user' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Gonzalez', description: 'Last name of the user' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'ana.gonzalez@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: Role, description: 'User role' })
  @IsEnum(Role)
  role: Role;

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

  @ApiPropertyOptional({ example: 'http://example.com/verificacion', description: 'Verification URL for MEDICO role' })
  @IsString()
  @ValidateIf(o => o.role === 'MEDICO')
  verificacion?: string;

  @ApiPropertyOptional({ example: '123456789', description: 'DNI for EMPRESA role' })
  @IsString()
  @ValidateIf(o => o.role === 'EMPRESA')
  dni?: string;
}
