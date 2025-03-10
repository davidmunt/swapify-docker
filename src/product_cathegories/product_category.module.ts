import { Module } from '@nestjs/common';
import { ProductCategoryController } from './product_category.controller';
import { ProductCategoryService } from './product_category.service';
import { ProductCategory } from './product_category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  exports: [TypeOrmModule],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
})
export class ProductCategoryModule {}