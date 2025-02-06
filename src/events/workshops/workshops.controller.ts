import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Patch,
    Delete,
    NotFoundException,
  } from '@nestjs/common';
  import { WorkshopsService } from './workshops.service';
  
  @Controller('workshops')
  export class WorkshopsController {
    constructor(private readonly workshopsService: WorkshopsService) {}
  
    @Post()
    async createWorkshop(@Body() body: any) {
      return this.workshopsService.createWorkshop(body);
    }
  
    @Get(':id')
    async getWorkshop(@Param('id') id: string) {
      const workshop = await this.workshopsService.getWorkshopById(id);
      if (!workshop) throw new NotFoundException('Workshop no encontrado');
      return workshop;
    }
  
    @Patch(':id')
    async updateWorkshop(@Param('id') id: string, @Body() data: any) {
      return this.workshopsService.updateWorkshop(id, data);
    }
  
    @Delete(':id')
    async deleteWorkshop(@Param('id') id: string) {
      return this.workshopsService.deleteWorkshop(id);
    }
  
    @Get('channel/:channelName')
    async getWorkshopByChannel(@Param('channelName') channelName: string) {
      const workshop = await this.workshopsService.getWorkshopByChannel(channelName);
      if (!workshop) throw new NotFoundException('Workshop no encontrado');
      return workshop;
    }
  }
  