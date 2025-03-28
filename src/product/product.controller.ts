import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, FilterProductDto, BuyProductDto, SwapProductDto } from './product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Product')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @ApiOperation({ summary: 'Obtener todos los productos' })
    @ApiResponse({ status: 200, description: 'Lista de productos obtenida con exito' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @Get()
    async getAllProducts() {
        return await this.productService.getAllProducts();
    }

    @ApiOperation({ summary: 'Obtener un producto por ID' })
    @ApiResponse({ status: 200, description: 'Producto obtenido con exito' })
    @ApiResponse({ status: 400, description: 'ID de producto invalido' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @Get(':id')
    async getProduct(@Param('id') id: string) {
        return this.productService.getProduct(parseInt(id));
    }

    @ApiOperation({ summary: 'Obtener productos filtrados' })
    @ApiResponse({ status: 200, description: 'Lista de productos filtrados obtenida con exito' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @Post('filters')
    async getFilteredProducts(@Body() filters: FilterProductDto) {
        return await this.productService.getFilteredProducts(filters);
    }

    @ApiOperation({ summary: 'Crear un nuevo producto' })
    @ApiResponse({ status: 201, description: 'Producto creado con exito' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    @ApiResponse({ status: 404, description: 'Usuario, categoria, estado o estado de venta no encontrado' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createProduct(@Body() createProductDto: CreateProductDto) {
        return await this.productService.createProduct(createProductDto);
    }

    @ApiOperation({ summary: 'Actualizar un producto' })
    @ApiResponse({ status: 200, description: 'Producto actualizado con exito' })
    @ApiResponse({ status: 400, description: 'ID de producto invalido o datos de entrada incorrectos' })
    @ApiResponse({ status: 404, description: 'Producto, categoria, estado o estado de venta no encontrado' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return await this.productService.updateProduct(parseInt(id), updateProductDto);
    }

    @ApiOperation({ summary: 'Eliminar un producto' })
    @ApiResponse({ status: 200, description: 'Producto eliminado con exito' })
    @ApiResponse({ status: 400, description: 'ID de producto invalido' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        return await this.productService.deleteProduct(parseInt(id));
    }

    @ApiOperation({ summary: 'Comprar un producto' })
    @ApiResponse({ status: 200, description: 'Producto comprado con exito' })
    @ApiResponse({ status: 400, description: 'Datos de compra invalidos o saldo insuficiente' })
    @ApiResponse({ status: 404, description: 'Producto, vendedor o comprador no encontrado' })
    @ApiResponse({ status: 406, description: 'El usuario no puede comprar su propio producto o el producto no esta en venta' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @UseGuards(JwtAuthGuard)
    @Post('buy')
    async buyProduct(@Body() buyProductDto: BuyProductDto) {
        return this.productService.buyProduct(buyProductDto.productId, buyProductDto.buyerId, buyProductDto.sellerId);
    }

    @ApiOperation({ summary: 'Intercambiar un producto' })
    @ApiResponse({ status: 200, description: 'Producto intercambiado con exito' })
    @ApiResponse({ status: 400, description: 'Datos de compra invalidos' })
    @ApiResponse({ status: 404, description: 'Producto, vendedor o comprador no encontrado' })
    @ApiResponse({ status: 406, description: 'El usuario no puede comprar su propio producto o el producto no esta en venta' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @UseGuards(JwtAuthGuard)
    @Post('swap')
    async swapProduct(@Body() swapProductDto: SwapProductDto) {
        return this.productService.swapProduct(swapProductDto.productId, swapProductDto.productSwapedId, swapProductDto.buyerId, swapProductDto.sellerId);
    }

    @ApiOperation({ summary: 'Obtener los productos que le has dado like' })
    @ApiResponse({ status: 200, description: 'Lista de productos filtrados obtenida con exito' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @UseGuards(JwtAuthGuard)
    @Get('likesProduct/:id')
    async getYoureLikedProducts(@Param('id') id: string) {
        return await this.productService.getYoureLikedProducts(id);
    }

    @ApiOperation({ summary: 'Obtener tus ventas y compras de productos' })
    @ApiResponse({ status: 200, description: 'Productos recibidos' })
    @ApiResponse({ status: 400, description: 'Datos de compra invalidos' })
    @ApiResponse({ status: 404, description: 'Producto, usu no encontrado' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @UseGuards(JwtAuthGuard)
    @Get('envolvement/:id')
    async getYoureEnvolventProducts(@Param('id') id: string) {
        return this.productService.getYoureEnvolventProducts(id);
    }

    @ApiOperation({ summary: 'Obtener los productos de un usuario' })
    @ApiResponse({ status: 200, description: 'Producto obtenido con exito' })
    @ApiResponse({ status: 400, description: 'ID de usuario invalido' })
    @UseGuards(JwtAuthGuard)
    @Get('user/:id')
    async getYoureProducts(@Param('id') id: string) {
        return this.productService.getYoureProducts(id);
    }
}
