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
  
  @Controller('product')
  export class ProductController {
    private ProductService: ProductService;
    constructor(ProductService: ProductService) {
      this.ProductService = ProductService;
    }
    @Get()
    getAllStatus(@Query('xml') xml?: string) {
      try {
        return this.ProductService.getAllProducts(xml);
      } catch (err) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: err,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
          {
            cause: err,
          },
        );
      }
    }
  
    @Post()
    createIssue(@Body() Issue) {
      return this.ProductService.createProduct(Issue);
    }
  
    @Get(':id')
    getIssue(@Param('id') id: string, @Query('xml') xml?: string) {
      return this.ProductService.getProduct(parseInt(id), xml);
    }
  
    @Put(':id')
    updateIssue(@Param('id') id: string, @Body() Issue) {
      return this.ProductService.updateProduct(parseInt(id), Issue);
    }
  
    @Delete(':id')
    deleteIssue(@Param('id') id: string) {
      return this.ProductService.deleteProduct(parseInt(id));
    }
  }