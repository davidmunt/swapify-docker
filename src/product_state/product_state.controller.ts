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
import { ProductStateService } from './product_state.service';
import { CreateProductStateDto, UpdateProductStateDto } from './product_state.dto';

@Controller('product_state')
export class ProductStateController {
  constructor(private readonly productStateService: ProductStateService) {}

  @Get()
  async getAllProductState(@Query('xml') xml?: string) {
    try {
      return this.productStateService.getAllProductState(xml);
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
  async getProductState(@Param('id') id: string, @Query('xml') xml?: string) {
    return this.productStateService.getProductState(parseInt(id), xml);
  }

  @Post()
  async createProductState(@Body() createProductStateDto: CreateProductStateDto) {
    return this.productStateService.createProductState(createProductStateDto);
  }

  @Put(':id')
  async updateProductState(
    @Param('id') id: string,
    @Body() updateProductStateDto: UpdateProductStateDto,
  ) {
    return this.productStateService.updateProductState(parseInt(id), updateProductStateDto);
  }

  @Delete(':id')
  async deleteProductState(@Param('id') id: string) {
    return this.productStateService.deleteProductState(parseInt(id));
  }
}