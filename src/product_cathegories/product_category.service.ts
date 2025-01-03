import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './product_category.entity';
import { UtilsService } from '../utils/utils.service';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './product_category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async getAllProductCategory(xml?: string): Promise<ProductCategory[] | string> {
    const productCategories = await this.productCategoryRepository.find({relations: ['products']});
    if (xml === 'true') {
      const jsonFormatted = JSON.stringify({ ProductCategories: productCategories });
      return this.utilsService.convertJSONtoXML(jsonFormatted);
    }
    return productCategories;
  }

  async getProductCategory(id: number, xml?: string): Promise<ProductCategory | string> {
    const productCategory = await this.productCategoryRepository.findOne({
      where: { id_category_product: id },
      relations: ['products'], 
    });
    if (!productCategory) {
      throw new HttpException('Product category not found', HttpStatus.NOT_FOUND);
    }
    if (xml === 'true') {
      const jsonFormatted = JSON.stringify(productCategory);
      return this.utilsService.convertJSONtoXML(jsonFormatted);
    }
    return productCategory;
  }

  async createProductCategory(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategory> {
    const productCategory = this.productCategoryRepository.create(createProductCategoryDto);
    return await this.productCategoryRepository.save(productCategory);
  }

  async updateProductCategory(id: number, updateProductCategoryDto: UpdateProductCategoryDto): Promise<ProductCategory> {
    const existingProductCategory = await this.productCategoryRepository.findOneBy({id_category_product: id});
    if (!existingProductCategory) {
      throw new HttpException('Product category not found', HttpStatus.NOT_FOUND);
    }
    await this.productCategoryRepository.update(id, updateProductCategoryDto);
    return this.productCategoryRepository.findOne({
      where: { id_category_product: id },
      relations: ['products'], 
    });
  }

  async deleteProductCategory(id: number): Promise<{ message: string }> {
    const existingProductCategory = await this.productCategoryRepository.findOneBy({id_category_product: id});
    if (!existingProductCategory) {
      throw new HttpException('Product category not found', HttpStatus.NOT_FOUND);
    }
    await this.productCategoryRepository.delete(id);
    return { message: 'Product category deleted successfully' };
  }
}
