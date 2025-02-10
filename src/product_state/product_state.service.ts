import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductState } from './product_state.entity';
import { CreateProductStateDto, UpdateProductStateDto } from './product_state.dto';

@Injectable()
export class ProductStateService {
  constructor(
    @InjectRepository(ProductState)
    private productStateRepository: Repository<ProductState>,
  ) {}

  async getAllProductState(): Promise<ProductState[]> {
    return await this.productStateRepository.find({ relations: ['products'] });
  }

  async getProductState(id: number): Promise<ProductState> {
    const productState = await this.productStateRepository.findOne({
      where: { id_state_product: id },
      relations: ['products'],
    });
    if (!productState) {
      throw new HttpException('Estado del producto no encontrado', HttpStatus.NOT_FOUND);
    }
    return productState;
  }

  async createProductState(createProductStateDto: CreateProductStateDto): Promise<ProductState> {
    const existingProductState = await this.productStateRepository.findOneBy({ name: createProductStateDto.name });
    if (existingProductState) {
      throw new HttpException('Este estado ya existe', HttpStatus.CONFLICT);
    }
    const productState = this.productStateRepository.create(createProductStateDto);
    return await this.productStateRepository.save(productState);
  }

  async updateProductState(id: number, updateProductStateDto: UpdateProductStateDto): Promise<ProductState> {
    const existingProductState = await this.productStateRepository.findOneBy({ id_state_product: id });
    if (!existingProductState) {
      throw new HttpException('Estado del producto no encontrado', HttpStatus.NOT_FOUND);
    }
    await this.productStateRepository.update(id, updateProductStateDto);
    return this.productStateRepository.findOne({
      where: { id_state_product: id },
      relations: ['products'],
    });
  }

  async deleteProductState(id: number): Promise<{ message: string }> {
    const existingProductState = await this.productStateRepository.findOneBy({ id_state_product: id });
    if (!existingProductState) {
      throw new HttpException('Estado del producto no encontrado', HttpStatus.NOT_FOUND);
    }
    await this.productStateRepository.delete(id);
    return { message: 'Estado del producto eliminado' };
  }
}
