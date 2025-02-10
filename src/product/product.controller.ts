import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    HttpStatus,
    HttpException,
    Body,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, FilterProductDto, BuyProductDto  } from './product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @ApiOperation({ summary: 'Obtener todos los productos' })
    @ApiResponse({ status: 200, description: 'Lista de productos obtenida con exito' })
    @Get()
    async getAllProducts() {
        return await this.productService.getAllProducts();
    }

    @ApiOperation({ summary: 'Obtener un producto por ID' })
    @ApiResponse({ status: 200, description: 'Producto obtenido con exito' })
    @Get(':id')
    async getProduct(@Param('id') id: string) {
        const product = await this.productService.getProduct(parseInt(id));
        if (!product) {
            throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
        }
        return product;
    }

    @ApiOperation({ summary: 'Obtener productos filtrados' })
    @ApiResponse({ status: 200, description: 'Lista de productos filtrados obtenida con éxito' })
    @Post('filters')
    async getFilteredProducts(@Body() filters: FilterProductDto) {
        return await this.productService.getFilteredProducts(filters);
    }

    @ApiOperation({ summary: 'Crear un nuevo producto' })
    @ApiResponse({ status: 201, description: 'Producto creado con exito' })
    @Post()
    async createProduct(@Body() createProductDto: CreateProductDto) {
        return await this.productService.createProduct(createProductDto);
    }

    @ApiOperation({ summary: 'Actualizar un producto' })
    @ApiResponse({ status: 200, description: 'Producto actualizado con exito' })
    @Put(':id')
    async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return await this.productService.updateProduct(parseInt(id), updateProductDto);
    }

    @ApiOperation({ summary: 'Eliminar un producto' })
    @ApiResponse({ status: 200, description: 'Producto eliminado con exito' })
    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        return await this.productService.deleteProduct(parseInt(id));
    }

    @ApiOperation({ summary: 'Comprar un producto' })
    @ApiResponse({ status: 200, description: 'Producto comprado con exito' })
    @Post('buy')
    async buyProduct(@Body() buyProductDto: BuyProductDto) {
        return this.productService.buyProduct(buyProductDto.productId, buyProductDto.buyerId, buyProductDto.sellerId);
    }
}
