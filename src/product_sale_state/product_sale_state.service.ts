import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSaleState } from './product_sale_state.entity';
import { UtilsService } from '../utils/utils.service';
import { CreateProductSaleStateDto, UpdateProductSaleStateDto } from './product_sale_state.dto';

@Injectable()
export class ProductSaleStateService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(ProductSaleState)
    private productSaleStateRepository: Repository<ProductSaleState>,
  ) {}

  async getAllProductSaleState(xml?: string): Promise<ProductSaleState[] | string> {
    const productSaleStates = await this.productSaleStateRepository.find({relations: ['products']});
    if (xml === 'true') {
      const jsonFormatted = JSON.stringify({ ProductSaleStates: productSaleStates });
      return this.utilsService.convertJSONtoXML(jsonFormatted);
    }
    return productSaleStates;
  }

  async getProductSaleState(id: number, xml?: string): Promise<ProductSaleState | string> {
    const productSaleState = await this.productSaleStateRepository.findOne({
      where: { id_sale_state_product: id },
      relations: ['products'], 
    });
    if (!productSaleState) {
      throw new HttpException('Product sale state not found', HttpStatus.NOT_FOUND);
    }
    if (xml === 'true') {
      const jsonFormatted = JSON.stringify(productSaleState);
      return this.utilsService.convertJSONtoXML(jsonFormatted);
    }
    return productSaleState;
  }

  async createProductSaleState(createProductSaleStateDto: CreateProductSaleStateDto): Promise<ProductSaleState> {
    const productSaleState = this.productSaleStateRepository.create(createProductSaleStateDto);
    return await this.productSaleStateRepository.save(productSaleState);
  }

  async updateProductSaleState(id: number, updateProductSaleStateDto: UpdateProductSaleStateDto): Promise<ProductSaleState> {
    const existingProductSaleState = await this.productSaleStateRepository.findOneBy({id_sale_state_product: id});
    if (!existingProductSaleState) {
      throw new HttpException('Product sale state not found', HttpStatus.NOT_FOUND);
    }
    await this.productSaleStateRepository.update(id, updateProductSaleStateDto);
    return this.productSaleStateRepository.findOne({
      where: { id_sale_state_product: id },
      relations: ['products'], 
    });
  }

  async deleteProductSaleState(id: number): Promise<{ message: string }> {
    const existingProductSaleState = await this.productSaleStateRepository.findOneBy({id_sale_state_product: id});
    if (!existingProductSaleState) {
      throw new HttpException('Product sale state not found', HttpStatus.NOT_FOUND);
    }
    await this.productSaleStateRepository.delete(id);
    return { message: 'Product sale state deleted successfully' };
  }
}
