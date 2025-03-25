import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { NotificationModule } from '../notification/notification.module'; 
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User]),
    NotificationModule,
    AuthModule
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [TypeOrmModule],
})
export class MessageModule {}
