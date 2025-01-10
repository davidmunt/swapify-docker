import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly UtilsService: UtilsService,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAllProducts(xml?: string): Promise<Product[] | string> {
    const allProducts = await this.productRepository.find({
      relations: ['user', 'product_category'],
    });
    if (xml === 'true') {
      const jsonForXml = JSON.stringify({ Product: allProducts });
      return this.UtilsService.convertJSONtoXML(jsonForXml);
    }
    return allProducts;
  }

  async getProduct(id: number, xml?: string): Promise<Product | string> {
    const product = await this.productRepository.findOne({
      where: { id_product: id },
      relations: ['user', 'product_category'],
    });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    if (xml === 'true') {
      const jsonForXml = JSON.stringify(product);
      return this.UtilsService.convertJSONtoXML(jsonForXml);
    }
    return product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const user = await this.userRepository.findOne({
      where: { id_user: createProductDto['user_id'] },
    });
    if (!user) {
      throw new HttpException(`User with ID ${createProductDto['user_id']} not found`, HttpStatus.BAD_REQUEST);
    }
    const newProduct = this.productRepository.create(createProductDto);
    return await this.productRepository.save(newProduct);
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({where: { id_product: id }});
    if (!existingProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({
      where: { id_user: updateProductDto['user_id'] },
    });
    if (!user) {
      throw new HttpException(`User with ID ${updateProductDto['user_id']} not found`, HttpStatus.BAD_REQUEST);
    }
    await this.productRepository.update(id, updateProductDto);
    return await this.productRepository.findOne({
      where: { id_product: id },
      relations: ['user', 'product_category'],
    });
  }

  async deleteProduct(id: number): Promise<void> {
    const existingProduct = await this.productRepository.findOne({
      where: { id_product: id },
    });
    if (!existingProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    await this.productRepository.delete(id);
  }
}
