import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductView } from './product_view.entity';
import { SaveProductViewDto } from './product_view.dto';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class ProductViewService {
  constructor(
    @InjectRepository(ProductView) private readonly productViewRepository: Repository<ProductView>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  ) {}

  async getAllProductViews(): Promise<ProductView[]> {
      return await this.productViewRepository.find({ relations: ['product', 'user'] });
    }

  async saveProductView(dto: SaveProductViewDto): Promise<ProductView> {
    const user = await this.userRepository.findOne({ where: { id_user: dto.id_user } });
    const product = await this.productRepository.findOne({ where: { id_product: dto.id_product } });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.BAD_REQUEST);
    }
    if (!product) {
        throw new HttpException('Producto no encontrado', HttpStatus.BAD_REQUEST);
    }
    const productView = this.productViewRepository.create({user, product});
    return await this.productViewRepository.save(productView);
  }
}
