import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { ClassroomService } from './classroom.service'
import { $Enums } from '@prisma/client'
import { Express } from 'express'

class CreateClassroomDto {
  @IsString() title: string
  @IsString() description: string
  @IsNumber() price: number
  @Type(() => Date) @IsDate() startDateTime: Date
  @Type(() => Date) @IsDate() endDateTime: Date
  @IsOptional() @IsString() channelName?: string
  @IsOptional() @IsArray() @ArrayUnique() @IsEnum($Enums.Profession, { each: true }) categories?: $Enums.Profession[]
  @IsOptional() @IsArray() @ArrayUnique() oratorIds?: string[]
  @IsOptional() @IsArray() @ArrayUnique() attendeeIds?: string[]
}

class UpdateClassroomDto extends PartialType(CreateClassroomDto) {}

class OratorDto {
  @IsString() instructorId: string
}

@ApiTags('Classrooms')
@Controller('empresas/:empresaId/classrooms')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ClassroomController {
  constructor(private readonly service: ClassroomService) {}

  @Post()
  @ApiOperation({ summary: 'Crear classroom' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description', 'price', 'startDateTime', 'endDateTime'],
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        startDateTime: { type: 'string', format: 'date-time' },
        endDateTime: { type: 'string', format: 'date-time' },
        channelName: { type: 'string' },
        categories: {
          type: 'array',
          items: { type: 'string', enum: Object.values($Enums.Profession) },
        },
        oratorIds: { type: 'array', items: { type: 'string' } },
        attendeeIds: { type: 'array', items: { type: 'string' } },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  create(
    @Param('empresaId') empresaId: string,
    @Body() dto: CreateClassroomDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.service.createClassroom({ ...dto, empresaId, image })
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar classroom' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  update(
    @Param('empresaId') empresaId: string,
    @Param('id') id: string,
    @Body() dto: UpdateClassroomDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.service.updateClassroom(id, { ...dto, empresaId, image })
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar classroom' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  remove(@Param('id') id: string) {
    return this.service.deleteClassroom(id)
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Próximos classrooms' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  upcoming() {
    return this.service.getUpcomingClassrooms()
  }

  @Get('live')
  @ApiOperation({ summary: 'Classrooms en vivo' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  live() {
    return this.service.getLiveClassrooms()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de classroom' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  findOne(@Param('id') id: string) {
    return this.service.getClassroomById(id)
  }

  @Patch(':id/add-orator')
  @ApiOperation({ summary: 'Agregar instructor' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  addOrator(@Param('id') id: string, @Body() dto: OratorDto) {
    return this.service.addOrator(id, dto.instructorId)
  }

  @Patch(':id/remove-orator')
  @ApiOperation({ summary: 'Quitar instructor' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  removeOrator(@Param('id') id: string, @Body() dto: OratorDto) {
    return this.service.removeOrator(id, dto.instructorId)
  }
}
