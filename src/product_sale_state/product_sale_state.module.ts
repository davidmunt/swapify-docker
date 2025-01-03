import { Module } from '@nestjs/common';
import { ProductSaleStateController } from './product_sale_state.controller';
import { ProductSaleStateService } from './product_sale_state.service';
import { UtilsModule } from '../utils/utils.module';
import { ProductSaleState } from './product_sale_state.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([ProductSaleState])],
  exports: [TypeOrmModule],
  controllers: [ProductSaleStateController],
  providers: [ProductSaleStateService],
})
export class ProductSaleStateModule {}