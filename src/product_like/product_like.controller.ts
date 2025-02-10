import { Controller, Post, Delete, Body } from '@nestjs/common';
import { ProductLikeService } from './product_like.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductLikeDto } from './product_like.dto';

@ApiTags('Product Like')
@Controller('product_like')
export class ProductLikeController {
  constructor(private readonly productLikeService: ProductLikeService) {}

  @Post()
  @ApiOperation({ summary: 'Dar like a un producto' })
  @ApiResponse({ status: 201, description: 'Like agregado exitosamente' })
  async likeProduct(@Body() productLikeDto: ProductLikeDto): Promise<void> {
    await this.productLikeService.likeProduct(productLikeDto.productId, productLikeDto.userId);
  }

  @Delete()
  @ApiOperation({ summary: 'Quitar like de un producto' })
  @ApiResponse({ status: 200, description: 'Like eliminado exitosamente' })
  async unlikeProduct(@Body() productLikeDto: ProductLikeDto): Promise<void> {
    await this.productLikeService.unlikeProduct(productLikeDto.productId, productLikeDto.userId);
  }
}
