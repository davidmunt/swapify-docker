import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductViewService } from './product_view.service';
import { SaveProductViewDto } from './product_view.dto';
import { ProductView } from './product_view.entity';

@ApiTags('Product View')
@Controller('product_view')
export class ProductViewController {
  constructor(private readonly productViewService: ProductViewService) {}

  @Get()
    @ApiOperation({ summary: 'Obtener todas las categorias de productos' })
    @ApiResponse({ status: 200, description: 'Lista de categorias obtenida con exito', type: [ProductView] })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getAllProductCategory() {
      try {
        return this.productViewService.getAllProductViews();
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

  @Post()
  @ApiOperation({ summary: 'Registrar una visita a un producto' })
  @ApiResponse({ status: 201, description: 'Visita registrada correctamente', type: ProductView })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async saveProductView(@Body() saveProductViewDto: SaveProductViewDto): Promise<ProductView> {
    return this.productViewService.saveProductView(saveProductViewDto);
  }
}
