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
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductCategoryService } from './product_category.service';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './product_category.dto';
import { ProductCategory } from './product_category.entity';

@Controller('product_category')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorias de productos' })
  @ApiResponse({ status: 200, description: 'Lista de categorias obtenida con exito', type: [ProductCategory] })
  async getAllProductCategory() {
    try {
      return this.productCategoryService.getAllProductCategory();
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
  @ApiOperation({ summary: 'Obtener una categoria de producto por ID' })
  @ApiResponse({ status: 200, description: 'Categoria obtenida con exito', type: ProductCategory })
  async getProductCategory(@Param('id') id: string) {
    return this.productCategoryService.getProductCategory(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoria de producto' })
  @ApiResponse({ status: 201, description: 'Categoria creada correctamente', type: ProductCategory })
  async createProductCategory(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.createProductCategory(createProductCategoryDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una categoria de producto existente' })
  @ApiResponse({ status: 200, description: 'Categoria actualizada correctamente', type: ProductCategory })
  async updateProductCategory(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoryService.updateProductCategory(parseInt(id), updateProductCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una categoria de producto' })
  @ApiResponse({ status: 200, description: 'Categoria eliminada correctamente' })
  async deleteProductCategory(@Param('id') id: string) {
    return this.productCategoryService.deleteProductCategory(parseInt(id));
  }
}
