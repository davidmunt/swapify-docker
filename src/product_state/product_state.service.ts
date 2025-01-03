import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductState } from './product_state.entity';
import { UtilsService } from '../utils/utils.service';
import { CreateProductStateDto, UpdateProductStateDto } from './product_state.dto';

@Injectable()
export class ProductStateService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(ProductState)
    private productStateRepository: Repository<ProductState>,
  ) {}

  async getAllProductState(xml?: string): Promise<ProductState[] | string> {
    const productStates = await this.productStateRepository.find({relations: ['products']});
    if (xml === 'true') {
      const jsonFormatted = JSON.stringify({ ProductStates: productStates });
      return this.utilsService.convertJSONtoXML(jsonFormatted);
    }
    return productStates;
  }

  async getProductState(id: number, xml?: string): Promise<ProductState | string> {
    const productState = await this.productStateRepository.findOne({
      where: { id_state_product: id },
      relations: ['products'], 
    });
    if (!productState) {
      throw new HttpException('Product state not found', HttpStatus.NOT_FOUND);
    }
    if (xml === 'true') {
      const jsonFormatted = JSON.stringify(productState);
      return this.utilsService.convertJSONtoXML(jsonFormatted);
    }
    return productState;
  }

  async createProductState(createProductStateDto: CreateProductStateDto): Promise<ProductState> {
    const productState = this.productStateRepository.create(createProductStateDto);
    return await this.productStateRepository.save(productState);
  }

  async updateProductState(id: number, updateProductStateDto: UpdateProductStateDto): Promise<ProductState> {
    const existingProductState = await this.productStateRepository.findOneBy({id_state_product: id});
    if (!existingProductState) {
      throw new HttpException('Product state not found', HttpStatus.NOT_FOUND);
    }
    await this.productStateRepository.update(id, updateProductStateDto);
    return this.productStateRepository.findOne({
      where: { id_state_product: id },
      relations: ['products'], 
    });
  }

  async deleteProductState(id: number): Promise<{ message: string }> {
    const existingProductState = await this.productStateRepository.findOneBy({id_state_product: id});
    if (!existingProductState) {
      throw new HttpException('Product state not found', HttpStatus.NOT_FOUND);
    }
    await this.productStateRepository.delete(id);
    return { message: 'Product state deleted successfully' };
  }
}
