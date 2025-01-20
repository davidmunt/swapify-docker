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
    Query,
  } from '@nestjs/common';
  import { ProductService } from './product.service';
  import { CreateProductDto, UpdateProductDto } from './product.dto';
  import { FilesInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
  
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}
  
    @Get()
    async getAllProducts(@Query('xml') xml?: string) {
        return await this.productService.getAllProducts(xml);
    }

    @Get(':id')
    async getProduct(@Param('id') id: string, @Query('xml') xml?: string) {
        const product = await this.productService.getProduct(parseInt(id), xml);
        if (!product) {
            throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
        }
        return product;
    }

    @Post('filters')
    async getFilteredProducts(@Body() filters: any) {
        return await this.productService.getFilteredProducts(filters);
    }

    @Post()
    async createProduct(@Body() createProductDto: CreateProductDto) {
        return await this.productService.createProduct(createProductDto);
    }
  
    @Put(':id')
    async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return await this.productService.updateProduct(parseInt(id), updateProductDto);
    }
  
    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        return await this.productService.deleteProduct(parseInt(id));
    }

    @Post('buy')
    async buyProduct(@Body('productId') productId: number, @Body('buyerId') buyerId: string) {
        return this.productService.buyProduct(productId, buyerId);
    }
}