import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './product_category.entity';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './product_category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async getAllProductCategory(): Promise<ProductCategory[]> {
    return await this.productCategoryRepository.find({ relations: ['products'] });
  }

  async getProductCategory(id: number): Promise<ProductCategory> {
    const productCategory = await this.productCategoryRepository.findOne({
      where: { id_category_product: id },
      relations: ['products'],
    });
    if (!productCategory) {
      throw new HttpException('Categoría de producto no encontrada', HttpStatus.NOT_FOUND);
    }
    return productCategory;
  }

  async createProductCategory(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategory> {
    const existingCategory = await this.productCategoryRepository.findOneBy({ name: createProductCategoryDto.name });
    if (existingCategory) {
      throw new HttpException('Esta categoría ya existe', HttpStatus.CONFLICT);
    }
    const productCategory = this.productCategoryRepository.create(createProductCategoryDto);
    return await this.productCategoryRepository.save(productCategory);
  }

  async updateProductCategory(id: number, updateProductCategoryDto: UpdateProductCategoryDto): Promise<ProductCategory> {
    const existingProductCategory = await this.productCategoryRepository.findOneBy({ id_category_product: id });
    if (!existingProductCategory) {
      throw new HttpException('Categoría de producto no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.productCategoryRepository.update(id, updateProductCategoryDto);
    return this.productCategoryRepository.findOne({
      where: { id_category_product: id },
      relations: ['products'],
    });
  }

  async deleteProductCategory(id: number): Promise<{ message: string }> {
    const existingProductCategory = await this.productCategoryRepository.findOneBy({ id_category_product: id });
    if (!existingProductCategory) {
      throw new HttpException('Categoría de producto no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.productCategoryRepository.delete(id);
    return { message: 'Categoría de producto eliminada correctamente' };
  }
}
