import { Controller, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { ProductLikeService } from './product_like.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductLikeDto } from './product_like.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Product Like')
@UseGuards(JwtAuthGuard)
@Controller('product_like')
export class ProductLikeController {
  constructor(private readonly productLikeService: ProductLikeService) {}

  @Post()
  @ApiOperation({ summary: 'Dar like a un producto' })
  @ApiResponse({ status: 201, description: 'Like agregado exitosamente' })
  @ApiResponse({ status: 400, description: 'No puedes dar like a tu propio producto o ya diste like' })
  @ApiResponse({ status: 404, description: 'Producto o usuario no encontrado' })
  async likeProduct(@Body() productLikeDto: ProductLikeDto): Promise<void> {
    await this.productLikeService.likeProduct(productLikeDto.productId, productLikeDto.userId);
  }

  @Delete()
  @ApiOperation({ summary: 'Quitar like de un producto' })
  @ApiResponse({ status: 200, description: 'Like eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Like no encontrado' })
  async unlikeProduct(@Body() productLikeDto: ProductLikeDto): Promise<void> {
    await this.productLikeService.unlikeProduct(productLikeDto.productId, productLikeDto.userId);
  }
}
