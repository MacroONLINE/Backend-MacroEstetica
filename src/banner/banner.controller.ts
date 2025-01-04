import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { BannerService } from './banner.service';
  import { CreateBannerDto } from './dto/banner.dto';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  
  @ApiTags('banners')
  @Controller('banners')
  export class BannerController {
    constructor(private readonly bannerService: BannerService) {}
  
    @ApiOperation({ summary: 'Crear un nuevo banner' })
    @ApiResponse({ status: 201, description: 'Banner creado correctamente.' })
    @Post()
    async createBanner(@Body() body: CreateBannerDto) {
      try {
        const newBanner = await this.bannerService.createBanner(body);
        return newBanner;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  
    @ApiOperation({ summary: 'Obtener banner por ID' })
    @ApiResponse({ status: 200, description: 'Banner encontrado.' })
    @ApiResponse({ status: 404, description: 'No se encontró el banner.' })
    @Get(':id')
    async getBannerById(@Param('id') id: string) {
      const banner = await this.bannerService.getBannerById(id);
      if (!banner) {
        throw new HttpException('Banner no encontrado', HttpStatus.NOT_FOUND);
      }
      return banner;
    }
  
    @ApiOperation({ summary: 'Obtener banner aleatorio' })
    @ApiResponse({ status: 200, description: 'Banner aleatorio encontrado.' })
    @Get()
    async getRandomBanner() {
      const banner = await this.bannerService.getRandomBanner();
      if (!banner) {
        throw new HttpException('No hay banners en la base de datos', HttpStatus.NOT_FOUND);
      }
      return banner;
    }
  }
  