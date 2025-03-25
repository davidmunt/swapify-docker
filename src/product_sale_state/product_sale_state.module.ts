import { Module } from '@nestjs/common';
import { ProductSaleStateController } from './product_sale_state.controller';
import { ProductSaleStateService } from './product_sale_state.service';
import { ProductSaleState } from './product_sale_state.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSaleState]), AuthModule],
  exports: [TypeOrmModule],
  controllers: [ProductSaleStateController],
  providers: [ProductSaleStateService],
})
export class ProductSaleStateModule {}