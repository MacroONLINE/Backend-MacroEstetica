import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, Min, IsInt } from 'class-validator';

export class CreateBlogAuthorDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del usuario' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'Especialista en dermatología con 10 años de experiencia', description: 'Descripción del autor' })
  @IsString()
  description: string;

  @ApiProperty({ example: 10, description: 'Años de experiencia del autor' })
  @IsInt()
  @Min(0)
  experienceYears: number;

  @ApiProperty({ example: 'https://miweb.com/certificados.pdf', description: 'URL de certificados del autor', required: false })
  @IsOptional()
  @IsString()
  certificationsUrl?: string;
}
