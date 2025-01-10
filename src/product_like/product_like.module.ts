import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductLike } from './product_like.entity';
import { ProductLikeService } from './product_like.service';
import { ProductLikeController } from './product_like.controller';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductLike, Product, User])],
  controllers: [ProductLikeController],
  providers: [ProductLikeService],
  exports: [TypeOrmModule],
})
export class ProductLikeModule {}
