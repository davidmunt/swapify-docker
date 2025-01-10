import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { UtilsModule } from '../utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { User } from '../user/user.entity';
import { ProductCategory } from '../product_cathegories/product_category.entity';
import { ProductState } from '../product_state/product_state.entity';
import { ProductLike } from '../product_like/product_like.entity';
import { UploadEntity } from '../upload/upload.entity';
import { ProductLikeModule } from '../product_like/product_like.module';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([Product, User, UploadEntity, ProductCategory, ProductState, ProductLike]), ProductLikeModule],
  exports: [TypeOrmModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
