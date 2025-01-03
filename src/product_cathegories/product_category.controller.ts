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
import { ProductCategoryService } from './product_category.service';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './product_category.dto';

@Controller('product_category')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @Get()
  async getAllProductCategory(@Query('xml') xml?: string) {
    try {
      return this.productCategoryService.getAllProductCategory(xml);
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
  async getProductCategory(@Param('id') id: string, @Query('xml') xml?: string) {
    return this.productCategoryService.getProductCategory(parseInt(id), xml);
  }

  @Post()
  async createProductCategory(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.createProductCategory(createProductCategoryDto);
  }

  @Put(':id')
  async updateProductCategory(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoryService.updateProductCategory(parseInt(id), updateProductCategoryDto);
  }

  @Delete(':id')
  async deleteProductCategory(@Param('id') id: string) {
    return this.productCategoryService.deleteProductCategory(parseInt(id));
  }
}