import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UploadEntity } from '../upload/upload.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductCategory } from '../product_cathegories/product_category.entity';
import { ProductState } from '../product_state/product_state.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly UtilsService: UtilsService,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ProductCategory) private productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(ProductState) private productStateRepository: Repository<ProductState>,
  ) {}

  async getAllProducts(xml?: string): Promise<Product[]> {
    const allProducts = await this.productRepository.find({
      relations: ['user', 'product_category', 'product_state', 'images', 'likes', 'likes.user'], 
    });
    return allProducts;
  }  

  async getProduct(id: number, xml?: string): Promise<Product | string> {
    const product = await this.productRepository.findOne({
      where: { id_product: id },
      relations: ['user', 'product_category', 'product_state', 'images', 'likes', 'likes.user'],
    });
    if (!product) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    if (xml === 'true') {
      const jsonForXml = JSON.stringify(product);
      return this.UtilsService.convertJSONtoXML(jsonForXml);
    }
    return product;
  }

  async getFilteredProducts(filters: any): Promise<Product[]> {
    const allProducts = await this.productRepository.find({
      relations: ['user', 'product_category', 'product_state', 'images', 'likes', 'likes.user'],
    });
    let filteredProducts = allProducts;
    if (filters.busqueda) {
      const lowerBusqueda = filters.busqueda.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.product_model.toLowerCase().includes(lowerBusqueda) ||
          product.product_brand.toLowerCase().includes(lowerBusqueda) ||
          product.description.toLowerCase().includes(lowerBusqueda),
      );
    }
    if (filters.precioMax) {
      const maxPrice = parseFloat(filters.precioMax);
      filteredProducts = filteredProducts.filter((product) => parseFloat(product.price.toString()) <= maxPrice);
    }
    if (filters.precioMin) {
      const minPrice = parseFloat(filters.precioMin);
      filteredProducts = filteredProducts.filter((product) => parseFloat(product.price.toString()) >= minPrice);
    }
    if (filters.categoriaProd) {
      const categoriaId = parseInt(filters.categoriaProd, 10);
      filteredProducts = filteredProducts.filter((product) => product.product_category.id_category_product === categoriaId);
    }
    if (filters.proximidad) {
      if (!filters.latitud_usuario || !filters.longitud_usuario) {
        throw new HttpException('latitud_usuario y longitud_usuario son requeridos para el filtro de proximidad', HttpStatus.BAD_REQUEST,);
      }
      const userLat = parseFloat(filters.latitud_usuario);
      const userLon = parseFloat(filters.longitud_usuario);
      const maxDistanceKm = parseFloat(filters.proximidad);
      filteredProducts = filteredProducts.filter((product) => {
        const productLat = parseFloat(product.latitude_created.toString());
        const productLon = parseFloat(product.longitude_created.toString());
        const R = 6371; 
        const dLat = (productLat - userLat) * (Math.PI / 180);
        const dLon = (productLon - userLon) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(userLat * (Math.PI / 180)) *
            Math.cos(productLat * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance <= maxDistanceKm;
      });
    }
    return filteredProducts;
  }  

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const user = await this.userRepository.findOne({
      where: { id_user: createProductDto.user_id },
    });
    if (!user) {
      throw new HttpException(`User con id ${createProductDto.user_id} no encontrado`, HttpStatus.BAD_REQUEST);
    }
    const category = await this.productCategoryRepository.findOne({
      where: { id_category_product: createProductDto.id_category_product },
    });
    if (!category) {
      throw new HttpException(`Categoria con el id: ${createProductDto.id_category_product} no encontrado`, HttpStatus.BAD_REQUEST);
    }
    const state = await this.productStateRepository.findOne({
      where: { id_state_product: createProductDto.id_state_product },
    });
    if (!state) {
      throw new HttpException(`Categoria con el id: ${createProductDto.id_state_product} no encontrado`, HttpStatus.BAD_REQUEST);
    }
    const newProduct = this.productRepository.create(createProductDto);
    newProduct.user = user;
    newProduct.product_category = category; 
    newProduct.product_state = state; 
    return this.productRepository.save(newProduct);
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
        where: { id_product: id },
        relations: ['product_category', 'product_state'], 
    });
    if (!existingProduct) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    if (updateProductDto.id_category_product) {
        const category = await this.productCategoryRepository.findOne(
          {where: { id_category_product: updateProductDto.id_category_product },
        });
        if (!category) {
          throw new HttpException(`Categoria con el id: ${updateProductDto.id_category_product} no encontrado`, HttpStatus.BAD_REQUEST);
        }
        existingProduct.product_category = category;
    }
    if (updateProductDto.id_state_product) {
        const state = await this.productStateRepository.findOne({
            where: { id_state_product: updateProductDto.id_state_product },
        });
        if (!state) {
          throw new HttpException(`Estado con id: ${updateProductDto.id_state_product} no encontrado`, HttpStatus.BAD_REQUEST);
        }
        existingProduct.product_state = state;
    }
    this.productRepository.merge(existingProduct, updateProductDto);
    return await this.productRepository.save(existingProduct);
}

  async deleteProduct(id: number): Promise<void> {
    const existingProduct = await this.productRepository.findOne({
      where: { id_product: id },
    });
    if (!existingProduct) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    await this.productRepository.delete(id);
  }
  
  async buyProduct(productId: number, buyerId: string): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({
      where: { id_product: productId },
      relations: ['user'],
    });
    if (!product) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    const seller = product.user;
    const buyer = await this.userRepository.findOne({ where: { id_user: buyerId } });
    if (!buyer) {
      throw new HttpException('Comprador no encontrado', HttpStatus.NOT_FOUND);
    }
    if (buyer.id_user === seller.id_user) {
      throw new HttpException('No puedes comprar tu propio producto', HttpStatus.BAD_REQUEST);
    }
    const buyerBalance = parseFloat(buyer.balance.toString());
    const sellerBalance = parseFloat(seller.balance.toString());
    const productPrice = parseFloat(product.price.toString());
    if (isNaN(buyerBalance) || isNaN(sellerBalance) || isNaN(productPrice)) {
      throw new HttpException('Error al calcular los saldos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (buyerBalance < productPrice) {
      throw new HttpException('Saldo insuficiente', HttpStatus.BAD_REQUEST);
    }
    buyer.balance = parseFloat((buyerBalance - productPrice).toFixed(2));
    seller.balance = parseFloat((sellerBalance + productPrice).toFixed(2));
    await this.userRepository.save([buyer, seller]);
    await this.productRepository.delete(productId);
    return { message: 'Compra realizada con exito' };
  }
}
