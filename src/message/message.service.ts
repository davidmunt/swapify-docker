import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService, 
  ) {}

  async sendMessageForNotification(productId: number, text: string, sender: string, reciver: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id_product: productId },
      relations: ['user'],
    });
    if (!product) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    if (product.user.id_user != sender && product.user.id_user != reciver) { 
      throw new HttpException('Este producto no es tuyo', HttpStatus.BAD_REQUEST);
    }
    const senderUser = await this.userRepository.findOne({ where: { id_user: sender } });
    if (!senderUser) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    const reciverUser = await this.userRepository.findOne({ where: { id_user: reciver } });
    if (!reciverUser) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    if (reciverUser.tokenNotifications) {
        const message = {
          title: `${senderUser.name} ${senderUser.surname} (${product.product_brand} ${product.product_model})`,
          body: text || 'Imagen 📷',
          token: reciverUser.tokenNotifications,
          productId: product.id_product ?? 0,
          productOwnerId: product.user.id_user ?? '',
          potBuyerId: sender ?? '',
        };
        await this.notificationService.sendNotificationMessage(message); 
    }
  }
}
