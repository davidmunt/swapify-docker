import { Module } from '@nestjs/common';
import { ProductStateController } from './product_state.controller';
import { ProductStateService } from './product_state.service';
import { ProductState } from './product_state.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductState]), AuthModule],
  exports: [TypeOrmModule],
  controllers: [ProductStateController],
  providers: [ProductStateService],
})
export class ProductStateModule {}