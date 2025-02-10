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
import { ProductSaleStateService } from './product_sale_state.service';
import { CreateProductSaleStateDto, UpdateProductSaleStateDto } from './product_sale_state.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Product Sale State')
@Controller('product_sale_state')
export class ProductSaleStateController {
  constructor(private readonly productSaleStateService: ProductSaleStateService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los estados de venta de productos' })
  @ApiResponse({ status: 200, description: 'Lista de estados de venta obtenida exitosamente' })
  async getAllProductSaleState() {
    try {
      return this.productSaleStateService.getAllProductSaleState();
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
  @ApiOperation({ summary: 'Obtener un estado de venta de producto por ID' })
  @ApiResponse({ status: 200, description: 'Estado de venta obtenido exitosamente' })
  async getProductSaleState(@Param('id') id: string) {
    return this.productSaleStateService.getProductSaleState(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo estado de venta de producto' })
  @ApiResponse({ status: 201, description: 'Estado de venta creado exitosamente' })
  async createProductSaleState(@Body() createProductSaleStateDto: CreateProductSaleStateDto) {
    return this.productSaleStateService.createProductSaleState(createProductSaleStateDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un estado de venta de producto por ID' })
  @ApiResponse({ status: 200, description: 'Estado de venta actualizado exitosamente' })
  async updateProductSaleState(
    @Param('id') id: string,
    @Body() updateProductSaleStateDto: UpdateProductSaleStateDto,
  ) {
    return this.productSaleStateService.updateProductSaleState(parseInt(id), updateProductSaleStateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un estado de venta de producto por ID' })
  @ApiResponse({ status: 200, description: 'Estado de venta eliminado exitosamente' })
  async deleteProductSaleState(@Param('id') id: string) {
    return this.productSaleStateService.deleteProductSaleState(parseInt(id));
  }
}
