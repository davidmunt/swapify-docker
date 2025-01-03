import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductSaleStateService } from './product_sale_state.service';
import { CreateProductSaleStateDto, UpdateProductSaleStateDto } from './product_sale_state.dto';

@Controller('product_sale_state')
export class ProductSaleStateController {
  constructor(private readonly productSaleStateService: ProductSaleStateService) {}

  @Get()
  async getAllProductSaleState(@Query('xml') xml?: string) {
    try {
      return this.productSaleStateService.getAllProductSaleState(xml);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getProductSaleState(@Param('id') id: string, @Query('xml') xml?: string) {
    return this.productSaleStateService.getProductSaleState(parseInt(id), xml);
  }

  @Post()
  async createProductSaleState(@Body() createProductSaleStateDto: CreateProductSaleStateDto) {
    return this.productSaleStateService.createProductSaleState(createProductSaleStateDto);
  }

  @Put(':id')
  async updateProductSaleState(
    @Param('id') id: string,
    @Body() updateProductSaleStateDto: UpdateProductSaleStateDto,
  ) {
    return this.productSaleStateService.updateProductSaleState(parseInt(id), updateProductSaleStateDto);
  }

  @Delete(':id')
  async deleteProductSaleState(@Param('id') id: string) {
    return this.productSaleStateService.deleteProductSaleState(parseInt(id));
  }
}