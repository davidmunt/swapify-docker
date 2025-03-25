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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductCategoryService } from './product_category.service';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './product_category.dto';
import { ProductCategory } from './product_category.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('product_category')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorias de productos' })
  @ApiResponse({ status: 200, description: 'Lista de categorias obtenida con exito', type: [ProductCategory] })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
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
  @ApiResponse({ status: 400, description: 'ID de categoria invalido' })
  @ApiResponse({ status: 404, description: 'Categoria de producto no encontrada' })
  async getProductCategory(@Param('id') id: string) {
    return this.productCategoryService.getProductCategory(parseInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoria de producto' })
  @ApiResponse({ status: 201, description: 'Categoria creada correctamente', type: ProductCategory })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 409, description: 'La categoria ya existe' })
  async createProductCategory(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.createProductCategory(createProductCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una categoria de producto existente' })
  @ApiResponse({ status: 200, description: 'Categoria actualizada correctamente', type: ProductCategory })
  @ApiResponse({ status: 400, description: 'ID de categoria invalido o datos de entrada incorrectos' })
  @ApiResponse({ status: 404, description: 'Categoria de producto no encontrada' })
  async updateProductCategory(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoryService.updateProductCategory(parseInt(id), updateProductCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una categoria de producto' })
  @ApiResponse({ status: 200, description: 'Categoria eliminada correctamente' })
  @ApiResponse({ status: 400, description: 'ID de categoria invalido' })
  @ApiResponse({ status: 404, description: 'Categoria de producto no encontrada' })
  async deleteProductCategory(@Param('id') id: string) {
    return this.productCategoryService.deleteProductCategory(parseInt(id));
  }
}
