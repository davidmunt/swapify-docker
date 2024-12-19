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
import { InventariService } from './inventari.service';
import { CreateInventariDto } from './inventari.dto';

@Controller('inventari')
export class InventariController {
  private inventariService: InventariService;
  constructor(inventariService: InventariService) {
    this.inventariService = inventariService;
  }

  @Get()
  getAllInventaris(@Query('xml') xml: string) {
    return this.inventariService.getInventariAll(xml);
  }

  @Get(':id')
  getInventari(@Param('id') id: string, @Query('xml') xml: string) {
    return this.inventariService.getInventari(parseInt(id), xml);
  }

  @Post()
  createInventari(@Body() createInventariDto: CreateInventariDto) {
    return this.inventariService.createInventari(createInventariDto);
  }

  @Put(':id')
  updateInventari(
    @Param('id') id: string,
    @Body() createInventariDto: CreateInventariDto,
  ) {
    return this.inventariService.updateInventari(
      parseInt(id),
      createInventariDto,
    );
  }

  @Delete(':id')
  deleteInventari(@Param('id') id: string) {
    return this.inventariService.deleteInventari(parseInt(id));
  }
  @Post('pdf')
  generate_qr(@Body() inventory_items: number[], @Res() res: any) {
    const inventoryIdItems = inventory_items;
    return this.inventariService.generate_qr(inventoryIdItems, res);
  }
}
