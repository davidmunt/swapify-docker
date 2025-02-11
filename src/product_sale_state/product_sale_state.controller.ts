import {
  Body,
  Controller,
  Delete,
  Get,
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
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async getAllProductSaleState() {
    return this.productSaleStateService.getAllProductSaleState();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un estado de venta de producto por ID' })
  @ApiResponse({ status: 200, description: 'Estado de venta obtenido exitosamente' })
  @ApiResponse({ status: 400, description: 'ID del estado de venta invalido' })
  @ApiResponse({ status: 404, description: 'Estado de venta no encontrado' })
  async getProductSaleState(@Param('id') id: string) {
    return this.productSaleStateService.getProductSaleState(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo estado de venta de producto' })
  @ApiResponse({ status: 201, description: 'Estado de venta creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos invalidos para la creacion del estado de venta' })
  @ApiResponse({ status: 409, description: 'El estado de la venta ya existe' })
  async createProductSaleState(@Body() createProductSaleStateDto: CreateProductSaleStateDto) {
    return this.productSaleStateService.createProductSaleState(createProductSaleStateDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un estado de venta de producto por ID' })
  @ApiResponse({ status: 200, description: 'Estado de venta actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos invalidos para la actualizacion del estado de venta' })
  @ApiResponse({ status: 404, description: 'Estado de venta no encontrado' })
  async updateProductSaleState(@Param('id') id: string, @Body() updateProductSaleStateDto: UpdateProductSaleStateDto) {
    return this.productSaleStateService.updateProductSaleState(parseInt(id), updateProductSaleStateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un estado de venta de producto por ID' })
  @ApiResponse({ status: 200, description: 'Estado de venta eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'ID del estado de venta invalido' })
  @ApiResponse({ status: 404, description: 'Estado de venta no encontrado' })
  async deleteProductSaleState(@Param('id') id: string) {
    return this.productSaleStateService.deleteProductSaleState(parseInt(id));
  }
}
