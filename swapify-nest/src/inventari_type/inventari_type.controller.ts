import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { InventariTypeService } from './inventari_type.service';
import { Response } from 'express';

@Controller('inventari_type')
export class InventariTypeController {
  constructor(private readonly inventariTypeService: InventariTypeService) {}

  @Get()
  async getAllInventariType(
    @Query('format') format?: string,
    @Res() res?: Response,
  ) {
    const data = await this.inventariTypeService.getAllInventariType(format);

    if (format === 'xml' && res) {
      res.set('Content-Type', 'application/xml');
      return res.send(data);
    }

    return res ? res.json(data) : data;
  }

  @Get(':id')
  async getInventariType(
    @Param('id') id: string,
    @Query('format') format?: string,
    @Res() res?: Response,
  ) {
    const data = await this.inventariTypeService.getInventariType(
      parseInt(id),
      format,
    );

    if (format === 'xml' && res) {
      res.set('Content-Type', 'application/xml');
      return res.send(data);
    }

    return res ? res.json(data) : data;
  }

  @Post()
  createInventariType(@Body() inventari_type) {
    return this.inventariTypeService.createInventariType(inventari_type);
  }

  @Put(':id')
  updateInventariType(@Param('id') id: string, @Body() inventari_type) {
    return this.inventariTypeService.updateInventariType(
      parseInt(id),
      inventari_type,
    );
  }

  @Delete(':id')
  deleteInventariType(@Param('id') id: string) {
    return this.inventariTypeService.deleteInventariType(parseInt(id));
  }
}
