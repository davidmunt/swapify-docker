import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductStateService } from './product_state.service';
import { CreateProductStateDto, UpdateProductStateDto } from './product_state.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Product State')
@Controller('product_state')
export class ProductStateController {
  constructor(private readonly productStateService: ProductStateService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los estados de productos' })
  @ApiResponse({ status: 200, description: 'Lista de estados de productos obtenida exitosamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async getAllProductState() {
    return this.productStateService.getAllProductState();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un estado de producto por ID' })
  @ApiResponse({ status: 200, description: 'Estado de producto obtenido exitosamente' })
  @ApiResponse({ status: 400, description: 'ID del estado del producto invalido' })
  @ApiResponse({ status: 404, description: 'Estado del producto no encontrado' })
  async getProductState(@Param('id') id: string) {
    return this.productStateService.getProductState(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo estado de producto' })
  @ApiResponse({ status: 201, description: 'Estado de producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos invalidos para la creacion del estado de producto' })
  @ApiResponse({ status: 409, description: 'El estado del producto ya existe' })
  async createProductState(@Body() createProductStateDto: CreateProductStateDto) {
    return this.productStateService.createProductState(createProductStateDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un estado de producto por ID' })
  @ApiResponse({ status: 200, description: 'Estado de producto actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos invalidos para la actualizacion del estado de producto' })
  @ApiResponse({ status: 404, description: 'Estado del producto no encontrado' })
  async updateProductState(@Param('id') id: string, @Body() updateProductStateDto: UpdateProductStateDto) {
    return this.productStateService.updateProductState(parseInt(id), updateProductStateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un estado de producto por ID' })
  @ApiResponse({ status: 200, description: 'Estado de producto eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'ID del estado del producto invalido' })
  @ApiResponse({ status: 404, description: 'Estado del producto no encontrado' })
  async deleteProductState(@Param('id') id: string) {
    return this.productStateService.deleteProductState(parseInt(id));
  }
}
