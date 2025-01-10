import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductLike } from './product_like.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ProductLikeService {
  constructor(
    @InjectRepository(ProductLike)
    private readonly productLikeRepository: Repository<ProductLike>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async likeProduct(productId: number, userId: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id_product: productId } });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({ where: { id_user: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const existingLike = await this.productLikeRepository.findOne({
      where: { product: { id_product: productId }, user: { id_user: userId } },
    });
    if (existingLike) {
      throw new HttpException('User already liked this product', HttpStatus.BAD_REQUEST);
    }
    const like = this.productLikeRepository.create({ product, user });
    await this.productLikeRepository.save(like);
  }

  async unlikeProduct(productId: number, userId: string): Promise<void> {
    const like = await this.productLikeRepository.findOne({
      where: { product: { id_product: productId }, user: { id_user: userId } },
    });
    if (!like) {
      throw new HttpException('Like not found', HttpStatus.NOT_FOUND);
    }
    await this.productLikeRepository.delete(like.id);
  }
}