import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductLike } from './product_like.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ProductLikeService {
  constructor(
    @InjectRepository(ProductLike) private readonly productLikeRepository: Repository<ProductLike>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService, 
  ) {}

  async likeProduct(productId: number, userId: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id_product: productId },
      relations: ['user'],
    });
    if (!product) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    if (product.user.id_user === userId) {
      throw new HttpException('No puedes dar like a tu propio producto', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({ where: { id_user: userId } });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    const existingLike = await this.productLikeRepository.findOne({
      where: { 
        product: { id_product: productId }, 
        user: { id_user: userId } 
      },
    });
    if (existingLike) {
      throw new HttpException('El usuario ya ha dado like a este producto', HttpStatus.BAD_REQUEST);
    }
    const like = this.productLikeRepository.create({ product, user });
    await this.productLikeRepository.save(like);
    if (product.user.tokenNotifications) {
      const message = {
        title: `Hola ${product.user.name}`,
        body: `Alguien le ha dado like a tu producto ${product.product_brand} ${product.product_model}`,
        token: product.user.tokenNotifications,
      };
      await this.notificationService.sendNotificationLikeProduct(message);
    }
  }

  async unlikeProduct(productId: number, userId: string): Promise<void> {
    const like = await this.productLikeRepository.findOne({
      where: { product: { id_product: productId }, user: { id_user: userId } },
    });
    if (!like) {
      throw new HttpException('Like no encontrado', HttpStatus.NOT_FOUND);
    }

    await this.productLikeRepository.delete(like.id);
  }
}
