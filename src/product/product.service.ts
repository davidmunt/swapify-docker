import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductCategory } from '../product_cathegories/product_category.entity';
import { ProductState } from '../product_state/product_state.entity';
import { ProductSaleState } from '../product_sale_state/product_sale_state.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ProductCategory) private productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(ProductState) private productStateRepository: Repository<ProductState>,
    @InjectRepository(ProductSaleState) private productSaleStateRepository: Repository<ProductSaleState>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    const allProducts = await this.productRepository.find({
      relations: ['user', 'product_category', 'product_state', 'product_sale_state', 'images', 'likes', 'likes.user', 'buyer', 'exchangedWith'], 
    });
    return allProducts;
  }  

  async getProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id_product: id },
      relations: ['user', 'product_category', 'product_state', 'product_sale_state', 'images', 'likes', 'likes.user', 'buyer', 'exchangedWith'],
    });
    if (!product) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async getFilteredProducts(filters: any): Promise<Product[]> {
    const allProducts = await this.productRepository.find({
      relations: ['user', 'product_category', 'product_state', 'product_sale_state', 'images', 'likes', 'likes.user', 'buyer', 'exchangedWith'],
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
        throw new HttpException('latitud_usuario y longitud_usuario son necesario para el filtro de proximidad', HttpStatus.BAD_REQUEST,);
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
      throw new HttpException("Usuario no encontrado", HttpStatus.BAD_REQUEST);
    }
    const category = await this.productCategoryRepository.findOne({
      where: { id_category_product: createProductDto.id_category_product },
    });
    if (!category) {
      throw new HttpException("Categoria del producto no encontrado", HttpStatus.BAD_REQUEST);
    }
    const state = await this.productStateRepository.findOne({
      where: { id_state_product: createProductDto.id_state_product },
    });
    if (!state) {
      throw new HttpException("Estado del producto no encontrado", HttpStatus.BAD_REQUEST);
    }
    const saleState = await this.productSaleStateRepository.findOne({
      where: { id_sale_state_product: createProductDto.id_sale_state_product },
    });
    if (!saleState) {
      throw new HttpException("Estado del la compra del producto no encontrado", HttpStatus.BAD_REQUEST);
    }
    if (createProductDto.product_model.trim() === '') {
      throw new HttpException('El modelo del producto no puede estar vacio', HttpStatus.BAD_REQUEST);
    }
    if (createProductDto.product_brand.trim() === '') {
      throw new HttpException('La marca del producto no puede estar vacia', HttpStatus.BAD_REQUEST);
    }
    if (createProductDto.description.trim() === '') {
      throw new HttpException('La descripción del producto no puede estar vacia', HttpStatus.BAD_REQUEST);
    }
    if (createProductDto.price == null || createProductDto.price < 0) {
      throw new HttpException('El precio no puede ser negativo', HttpStatus.BAD_REQUEST);
    }    
    const newProduct = this.productRepository.create(createProductDto);
    newProduct.user = user;
    newProduct.product_category = category; 
    newProduct.product_state = state; 
    newProduct.product_sale_state = saleState; 
    return this.productRepository.save(newProduct);
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { id_product: id },
      relations: ['product_category', 'product_state', 'product_sale_state', 'user', 'buyer', 'exchangedWith'], 
    });
    if (!existingProduct) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    if (updateProductDto.id_category_product) {
        const category = await this.productCategoryRepository.findOne(
          {where: { id_category_product: updateProductDto.id_category_product },
        });
        if (!category) {
          throw new HttpException("Categoria del producto no encontrado", HttpStatus.BAD_REQUEST);
        }
        existingProduct.product_category = category;
    }
    if (updateProductDto.id_state_product) {
        const state = await this.productStateRepository.findOne({
          where: { id_state_product: updateProductDto.id_state_product },
        });
        if (!state) {
          throw new HttpException("Estado del producto no encontrado", HttpStatus.BAD_REQUEST);
        }
        existingProduct.product_state = state;
    }
    if (updateProductDto.id_sale_state_product) {
      const saleState = await this.productSaleStateRepository.findOne({
        where: { id_sale_state_product: updateProductDto.id_sale_state_product },
      });
      if (!saleState) {
        throw new HttpException("Estado de la venta del producto no encontrado", HttpStatus.BAD_REQUEST);
      }
      if (saleState.name == "Vendido") {
        throw new HttpException("No se puede vender un producto de esta forma", HttpStatus.BAD_REQUEST);
      }
      existingProduct.product_sale_state = saleState;
    }
    if (updateProductDto.buyer_id) {
      const buyer = await this.userRepository.findOne({
        where: { id_user: updateProductDto.buyer_id },
      });
      if (!buyer) {
        throw new HttpException("Usuario no encontrado", HttpStatus.BAD_REQUEST);
      }
      existingProduct.buyer = buyer;
    }
    if (updateProductDto.product_model.trim() === '') {
      throw new HttpException('El modelo del producto no puede estar vacio', HttpStatus.BAD_REQUEST);
    }
    if (updateProductDto.product_brand.trim() === '') {
      throw new HttpException('La marca del producto no puede estar vacia', HttpStatus.BAD_REQUEST);
    }
    if (updateProductDto.description.trim() === '') {
      throw new HttpException('La descripción del producto no puede estar vacia', HttpStatus.BAD_REQUEST);
    }
    if (updateProductDto.price == null || updateProductDto.price < 0) {
      throw new HttpException('El precio no puede ser negativo', HttpStatus.BAD_REQUEST);
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
  
  async buyProduct(productId: number, buyerId: string, sellerId: string): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({
      where: { id_product: productId },
      relations: ['user', 'product_sale_state', 'exchangedWith'],
    });
    if (!product) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    const seller = await this.userRepository.findOne({ where: { id_user: sellerId } });
    if (!seller) {
      throw new HttpException('Vendedor no encontrado', HttpStatus.NOT_FOUND);
    }
    if (product.user.id_user != seller.id_user) {
      throw new HttpException('No es tu producto', HttpStatus.NOT_ACCEPTABLE);
    }
    const buyer = await this.userRepository.findOne({ where: { id_user: buyerId } });
    if (!buyer) {
      throw new HttpException('Comprador no encontrado', HttpStatus.NOT_FOUND);
    }
    if (buyer.id_user === seller.id_user) {
      throw new HttpException('No puedes comprar tu propio producto', HttpStatus.NOT_ACCEPTABLE);
    }
    if (product.product_sale_state.name != "En venta") {
      throw new HttpException('Este producto no esta a la venta', HttpStatus.NOT_ACCEPTABLE);
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
    const soldState = await this.productSaleStateRepository.findOne({
      where: { name: "Vendido" },
    });
    if (!soldState) {
      throw new HttpException('Estado de venta (Vendido) no encontrado', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    product.product_sale_state = soldState;
    product.buyer = buyer;
    await this.productRepository.save(product);
    return { message: 'Compra realizada con exito' };
  }  

  async getYoureProducts(userId: string): Promise<Product[]> {
    const user = await this.userRepository.findOne({
      where : { id_user: userId }
    })
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    const products = await this.productRepository.find({
      where: { user: user }, 
      relations: ['user', 'product_category', 'product_state', 'product_sale_state', 'images', 'likes', 'likes.user', 'buyer', 'exchangedWith'],
    });
    if (!products) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    return products;
  }

  async swapProduct(productId: number, productSwapedId: number, buyerId: string, sellerId: string): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({
      where: { id_product: productId },
      relations: ['user', 'product_sale_state', 'exchangedWith'],
    });
    if (!product) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    const productSwaped = await this.productRepository.findOne({
      where: { id_product: productSwapedId },
      relations: ['user', 'product_sale_state', 'exchangedWith'],
    });
    if (!productSwaped) {
      throw new HttpException('Producto intercambiado no encontrado', HttpStatus.NOT_FOUND);
    }
    if (product.exchangedWith != null || productSwaped.exchangedWith != null) {
      throw new HttpException('Uno de los productos ya ha sido intercambiado', HttpStatus.NOT_ACCEPTABLE);
    }    
    const seller = await this.userRepository.findOne({ where: { id_user: sellerId } });
    if (!seller) {
      throw new HttpException('Vendedor no encontrado', HttpStatus.NOT_FOUND);
    }
    if (product.user.id_user != seller.id_user) {
      throw new HttpException('No es tu producto', HttpStatus.NOT_ACCEPTABLE);
    }
    if (productId === productSwapedId) {
      throw new HttpException('No puedes intercambiar el mismo producto', HttpStatus.NOT_ACCEPTABLE);
    }
    if (product.user.id_user === productSwaped.user.id_user) {
      throw new HttpException('No puedes intercambiar productos que pertenecen a la misma persona', HttpStatus.NOT_ACCEPTABLE);
    } 
    if (product.buyer != null || productSwaped.buyer != null) {
      throw new HttpException('Uno de los productos ya ha sido vendido', HttpStatus.NOT_ACCEPTABLE);
    }      
    const buyer = await this.userRepository.findOne({ where: { id_user: buyerId } });
    if (!buyer) {
      throw new HttpException('Comprador no encontrado', HttpStatus.NOT_FOUND);
    }
    if (productSwaped.user.id_user != buyer.id_user) {
      throw new HttpException('No es tu producto', HttpStatus.NOT_ACCEPTABLE);
    }
    if (buyer.id_user === seller.id_user) {
      throw new HttpException('No puedes intercambiar tu propio producto', HttpStatus.NOT_ACCEPTABLE);
    }
    if (product.product_sale_state.name != "En venta") {
      throw new HttpException('Este producto no esta a la venta', HttpStatus.NOT_ACCEPTABLE);
    }
    if (productSwaped.product_sale_state.name != "En venta") {
      throw new HttpException('El producto de intercambio no esta a la venta', HttpStatus.NOT_ACCEPTABLE);
    }
    const soldState = await this.productSaleStateRepository.findOne({
      where: { name: "Vendido" },
    });
    if (!soldState) {
      throw new HttpException('Estado de venta (Vendido) no encontrado', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    product.product_sale_state = soldState;
    productSwaped.product_sale_state = soldState;
    product.buyer = buyer;
    productSwaped.buyer = seller;
    product.exchangedWith = productSwaped;
    productSwaped.exchangedWith = product;
    await this.productRepository.save(product);
    await this.productRepository.save(productSwaped);
    return { message: 'Intercambio realizado con exito' };
  }

  async getYoureLikedProducts(userID: any): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .leftJoinAndSelect('product.product_category', 'product_category')
      .leftJoinAndSelect('product.product_state', 'product_state')
      .leftJoinAndSelect('product.product_sale_state', 'product_sale_state')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'liked_user')
      .leftJoinAndSelect('product.buyer', 'buyer')
      .leftJoinAndSelect('product.exchangedWith', 'exchangedWith')
      .where('liked_user.id_user = :userID', { userID })
      .getMany();
  }

  async getYoureEnvolventProducts(userID: string): Promise<Product[]> {
    const envolventProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .leftJoinAndSelect('product.product_category', 'product_category')
      .leftJoinAndSelect('product.product_state', 'product_state')
      .leftJoinAndSelect('product.product_sale_state', 'product_sale_state')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'liked_user')
      .leftJoinAndSelect('product.buyer', 'buyer')
      .leftJoinAndSelect('product.exchangedWith', 'exchangedWith')
      .where('(product.product_sale_state = 4) AND (user.id_user = :userID OR buyer.id_user = :userID)', { userID })
      .orderBy('product.last_updated', 'DESC')
      .getMany(); 
    return envolventProducts;
  }     
}
