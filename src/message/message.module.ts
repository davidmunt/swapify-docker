import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { NotificationModule } from '../notification/notification.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User]),
    NotificationModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [TypeOrmModule],
})
export class MessageModule {}
