import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { User } from '../user/user.entity';
import { ProductCategory } from '../product_cathegories/product_category.entity';
import { ProductState } from '../product_state/product_state.entity';
import { ProductSaleState } from '../product_sale_state/product_sale_state.entity';
import { ProductLike } from '../product_like/product_like.entity';
import { UploadEntity } from '../upload/upload.entity';
import { ProductLikeModule } from '../product_like/product_like.module';
import { IAModule } from '../ia/ia.module';
import { ProductView } from '../product_view/product_view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User, UploadEntity, ProductCategory, ProductState, ProductSaleState, ProductLike, ProductView]), ProductLikeModule, IAModule],
  exports: [TypeOrmModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
