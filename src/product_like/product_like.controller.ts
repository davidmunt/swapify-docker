import { Controller, Post, Delete, Body, HttpCode } from '@nestjs/common';
import { ProductLikeService } from './product_like.service';

@Controller('product_like')
export class ProductLikeController {
  constructor(private readonly productLikeService: ProductLikeService) {}

  @Post()
  @HttpCode(201)
  async likeProduct(@Body('productId') productId: number, @Body('userId') userId: string): Promise<void> {
    await this.productLikeService.likeProduct(productId, userId);
  }

  @Delete()
  @HttpCode(204)
  async unlikeProduct(@Body('productId') productId: number, @Body('userId') userId: string): Promise<void> {
    await this.productLikeService.unlikeProduct(productId, userId);
  }
}
