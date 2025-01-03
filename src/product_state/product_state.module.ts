import { Module } from '@nestjs/common';
import { ProductStateController } from './product_state.controller';
import { ProductStateService } from './product_state.service';
import { UtilsModule } from '../utils/utils.module';
import { ProductState } from './product_state.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([ProductState])],
  exports: [TypeOrmModule],
  controllers: [ProductStateController],
  providers: [ProductStateService],
})
export class ProductStateModule {}