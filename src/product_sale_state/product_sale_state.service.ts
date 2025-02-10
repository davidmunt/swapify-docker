import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSaleState } from './product_sale_state.entity';
import { CreateProductSaleStateDto, UpdateProductSaleStateDto } from './product_sale_state.dto';

@Injectable()
export class ProductSaleStateService {
  constructor(
    @InjectRepository(ProductSaleState)
    private productSaleStateRepository: Repository<ProductSaleState>,
  ) {}

  async getAllProductSaleState(): Promise<ProductSaleState[]> {
    return await this.productSaleStateRepository.find({ relations: ['products'] });
  }

  async getProductSaleState(id: number): Promise<ProductSaleState> {
    const productSaleState = await this.productSaleStateRepository.findOne({
      where: { id_sale_state_product: id },
      relations: ['products'],
    });
    if (!productSaleState) {
      throw new HttpException('Estado de la venta del producto no encontrado', HttpStatus.NOT_FOUND);
    }
    return productSaleState;
  }

  async createProductSaleState(createProductSaleStateDto: CreateProductSaleStateDto): Promise<ProductSaleState> {
    const existingProductSaleState = await this.productSaleStateRepository.findOneBy({ name: createProductSaleStateDto.name });
    if (existingProductSaleState) {
      throw new HttpException('Este estado de la venta ya existe', HttpStatus.CONFLICT);
    }
    const productSaleState = this.productSaleStateRepository.create(createProductSaleStateDto);
    return await this.productSaleStateRepository.save(productSaleState);
  }

  async updateProductSaleState(id: number, updateProductSaleStateDto: UpdateProductSaleStateDto): Promise<ProductSaleState> {
    const existingProductSaleState = await this.productSaleStateRepository.findOneBy({ id_sale_state_product: id });
    if (!existingProductSaleState) {
      throw new HttpException('Estado de la venta del producto no encontrado', HttpStatus.NOT_FOUND);
    }
    await this.productSaleStateRepository.update(id, updateProductSaleStateDto);
    return this.productSaleStateRepository.findOne({
      where: { id_sale_state_product: id },
      relations: ['products'],
    });
  }

  async deleteProductSaleState(id: number): Promise<{ message: string }> {
    const existingProductSaleState = await this.productSaleStateRepository.findOneBy({ id_sale_state_product: id });
    if (!existingProductSaleState) {
      throw new HttpException('Estado de la venta del producto no encontrado', HttpStatus.NOT_FOUND);
    }
    await this.productSaleStateRepository.delete(id);
    return { message: 'Estado de la venta del producto eliminado' };
  }
}
