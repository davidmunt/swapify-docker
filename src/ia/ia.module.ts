import { Module } from '@nestjs/common';
import { IAService } from './ia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product.entity';
import { ProductView } from '../product_view/product_view.entity';
import { User } from '../user/user.entity';
import { ProductCategory } from '../product_cathegories/product_category.entity';
import { ProductState } from '../product_state/product_state.entity';
import { ProductSaleState } from '../product_sale_state/product_sale_state.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductView,
      User,
      ProductCategory,
      ProductState,
      ProductSaleState,
    ]),
  ],
  providers: [IAService],
  exports: [IAService],
})
export class IAModule {}
