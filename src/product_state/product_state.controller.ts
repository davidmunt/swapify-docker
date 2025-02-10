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
  async getAllProductState() {
    try {
      return this.productStateService.getAllProductState();
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
  @ApiOperation({ summary: 'Obtener un estado de producto por ID' })
  @ApiResponse({ status: 200, description: 'Estado de producto obtenido exitosamente' })
  async getProductState(@Param('id') id: string) {
    return this.productStateService.getProductState(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo estado de producto' })
  @ApiResponse({ status: 201, description: 'Estado de producto creado exitosamente' })
  async createProductState(@Body() createProductStateDto: CreateProductStateDto) {
    return this.productStateService.createProductState(createProductStateDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un estado de producto por ID' })
  @ApiResponse({ status: 200, description: 'Estado de producto actualizado exitosamente' })
  async updateProductState(
    @Param('id') id: string,
    @Body() updateProductStateDto: UpdateProductStateDto,
  ) {
    return this.productStateService.updateProductState(parseInt(id), updateProductStateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un estado de producto por ID' })
  @ApiResponse({ status: 200, description: 'Estado de producto eliminado exitosamente' })
  async deleteProductState(@Param('id') id: string) {
    return this.productStateService.deleteProductState(parseInt(id));
  }
}
