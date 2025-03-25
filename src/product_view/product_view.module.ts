import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { ProductView } from '../product_view/product_view.entity';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { IAModule } from '../ia/ia.module';
import { ProductViewController } from '../product_view/product_view.controller';
import { ProductViewService } from '../product_view/product_view.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductView, Product, User]), ProductModule, UserModule, IAModule, AuthModule],
  exports: [TypeOrmModule],
  controllers: [ProductViewController],
  providers: [ProductViewService],
})
export class ProductViewModule {}
