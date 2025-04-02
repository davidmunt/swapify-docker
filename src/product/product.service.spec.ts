import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { User } from '../user/user.entity';
import { ProductCategory } from '../product_cathegories/product_category.entity';
import { ProductState } from '../product_state/product_state.entity';
import { ProductSaleState } from '../product_sale_state/product_sale_state.entity';
import { ProductView } from '../product_view/product_view.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { IAService } from '../ia/ia.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';

const oneProductDto: CreateProductDto = {
  product_model: 'iPhone 14',
  product_brand: 'Apple',
  price: 999.99,
  description: 'Telefono en perfecto estado',
  latitude_created: 38.8100574,
  longitude_created: -0.6028540,
  name_city_created: 'Valencia',
  user_id: 'user1',
  id_category_product: 1,
  id_state_product: 1,
  id_sale_state_product: 1,
};

const mockProductUpdate: UpdateProductDto = {
  product_model: 'Galaxy S23',
  product_brand: 'Samsung',
  price: 899.99,
  description: 'Smartphone de ultima generacion',
  latitude_created: 40,
  longitude_created: -3,
  name_city_created: 'Madrid',
  id_category_product: 2,
  id_state_product: 2,
  id_sale_state_product: 2,
  buyer_id: 'buyer1',
};

const sampleUser = { id_user: 'user1', balance: 1000, products: [] };
const sampleCategory = { id_category_product: 1, name: 'Instrumentos Musicales' };
const sampleState = { id_state_product: 1, name: 'Nuevo' };
const sampleSaleState = { id_sale_state_product: 1, name: 'En venta' };

const sampleProduct = Object.assign({}, oneProductDto, {
  id_product: 1,
  user: sampleUser,
  product_category: sampleCategory,
  product_state: sampleState,
  product_sale_state: sampleSaleState,
  buyer: null,
  exchangedWith: null,
});

const sampleBuyer = { id_user: 'buyer1', balance: 1100, products: [] };
const sampleSeller = { id_user: 'user1', balance: 100, products: [] };

const sampleProductSwaped = Object.assign({}, oneProductDto, {
  id_product: 2,
  user: { id_user: 'user2', balance: 500, products: [] },
  product_category: sampleCategory,
  product_state: sampleState,
  product_sale_state: sampleSaleState,
});

describe('ProductService', () => {
  let productService: ProductService;

  const MockProductRepository = {
    find: jest.fn(() => Promise.resolve([sampleProduct])),
    findOne: jest.fn((criteria) => {
      const id = criteria.where.id_product;
      if (id === 1) return Promise.resolve(sampleProduct);
      if (id === 2) return Promise.resolve(sampleProductSwaped);
      return Promise.resolve(null);
    }),
    create: jest.fn((dto: any) => {
      const result = Object.assign({}, dto);
      result.id_product = 1;
      return result;
    }),
    save: jest.fn((data: any) => Promise.resolve(data)),
    merge: jest.fn((existing: any, update: any) => Object.assign(existing, update)),
    delete: jest.fn(() => Promise.resolve({ affected: 1 })),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(() => Promise.resolve([sampleProduct])),
    })),
  };

  const MockUserRepository = {
    findOne: jest.fn((criteria) => {
      const id = criteria.where.id_user;
      if (id === 'user1') return Promise.resolve(sampleUser);
      if (id === 'buyer1') return Promise.resolve(sampleBuyer);
      if (id === 'user2') return Promise.resolve({ id_user: 'user2', balance: 500, products: [] });
      return Promise.resolve(null);
    }),
    save: jest.fn((data: any) => Promise.resolve(data)),
  };

  const sampleUpdatedCategory = { id_category_product: 2, name: 'Otro' };
    const MockProductCategoryRepository = {
    findOne: jest.fn((criteria) => {
        const id = criteria.where.id_category_product;
        if (id === oneProductDto.id_category_product) return Promise.resolve(sampleCategory);
        if (id == mockProductUpdate.id_category_product) return Promise.resolve(sampleUpdatedCategory);
        return Promise.resolve(null);
    }),
    };

  const MockProductStateRepository = {
    findOne: jest.fn((criteria) => {
      const id = criteria.where.id_state_product;
      if (id === oneProductDto.id_state_product) return Promise.resolve(sampleState);
      if (id == mockProductUpdate.id_state_product) return Promise.resolve({ id_state_product: id, name: 'Usado' });
      return Promise.resolve(null);
    }),
  };
  const MockProductSaleStateRepository = {
    findOne: jest.fn((criteria) => {
      const saleId = criteria.where.id_sale_state_product;
      if (saleId == oneProductDto.id_sale_state_product) return Promise.resolve(sampleSaleState);
      if (saleId == mockProductUpdate.id_sale_state_product) return Promise.resolve({ id_sale_state_product: saleId, name: 'Otro estado' });
      if (criteria.where.name === 'Vendido') return Promise.resolve({ id_sale_state_product: 2, name: 'Vendido' });
      return Promise.resolve(null);
    }),
  };

  const MockProductViewRepository = {};
  const MockIAService = {
    orderProductsByProductView: jest.fn(() => Promise.resolve([sampleProduct])),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useValue: MockProductRepository },
        { provide: getRepositoryToken(User), useValue: MockUserRepository },
        { provide: getRepositoryToken(ProductCategory), useValue: MockProductCategoryRepository },
        { provide: getRepositoryToken(ProductState), useValue: MockProductStateRepository },
        { provide: getRepositoryToken(ProductSaleState), useValue: MockProductSaleStateRepository },
        { provide: getRepositoryToken(ProductView), useValue: MockProductViewRepository },
        { provide: IAService, useValue: MockIAService },
      ],
    }).compile();
    productService = module.get<ProductService>(ProductService);
  });

  it('debe estar definido', () => {
    expect(productService).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('devuelve todos los productos', async () => {
      const result = await productService.getAllProducts();
      expect(result).toEqual([sampleProduct]);
      expect(MockProductRepository.find).toHaveBeenCalledWith({
        relations: [
          'user',
          'product_category',
          'product_state',
          'product_sale_state',
          'images',
          'likes',
          'likes.user',
          'buyer',
          'exchangedWith',
        ],
      });
    });
  });

  describe('getProduct', () => {
    it('devuelve un producto por id', async () => {
      const result = await productService.getProduct(1);
      expect(result).toEqual(sampleProduct);
      expect(MockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id_product: 1 },
        relations: [
          'user',
          'product_category',
          'product_state',
          'product_sale_state',
          'images',
          'likes',
          'likes.user',
          'buyer',
          'exchangedWith',
        ],
      });
    });
    it('da un error si no se encuentra el producto', async () => {
      MockProductRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(productService.getProduct(2)).rejects.toThrow('Producto no encontrado');
    });
  });

  describe('createProduct', () => {
    it('crea un nuevo producto', async () => {
      const newProduct = Object.assign({}, oneProductDto, {
        id_product: 1,
        user: sampleUser,
        product_category: sampleCategory,
        product_state: sampleState,
        product_sale_state: sampleSaleState,
      });
      const result = await productService.createProduct(oneProductDto);
      expect(MockUserRepository.findOne).toHaveBeenCalledWith({ where: { id_user: oneProductDto.user_id } });
      expect(MockProductCategoryRepository.findOne).toHaveBeenCalledWith({ where: { id_category_product: oneProductDto.id_category_product } });
      expect(MockProductStateRepository.findOne).toHaveBeenCalledWith({ where: { id_state_product: oneProductDto.id_state_product } });
      expect(MockProductSaleStateRepository.findOne).toHaveBeenCalledWith({ where: { id_sale_state_product: oneProductDto.id_sale_state_product } });
      expect(MockProductRepository.create).toHaveBeenCalledWith(oneProductDto);
      expect(MockProductRepository.save).toHaveBeenCalled();
      expect(result).toEqual(newProduct);
    });
    it('da un error si el usuario no existe', async () => {
      MockUserRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(productService.createProduct(oneProductDto)).rejects.toThrow('Usuario no encontrado');
    });
    it('da un error si la categoria no existe', async () => {
      MockUserRepository.findOne.mockResolvedValue(sampleUser);
      MockProductCategoryRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(productService.createProduct(oneProductDto)).rejects.toThrow('Categoria del producto no encontrado');
    });
    it('da un error si el estado no existe', async () => {
      MockUserRepository.findOne.mockResolvedValue(sampleUser);
      MockProductCategoryRepository.findOne.mockResolvedValue(sampleCategory);
      MockProductStateRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(productService.createProduct(oneProductDto)).rejects.toThrow('Estado del producto no encontrado');
    });
    it('da un error si el estado de la compra no existe', async () => {
      MockUserRepository.findOne.mockResolvedValue(sampleUser);
      MockProductCategoryRepository.findOne.mockResolvedValue(sampleCategory);
      MockProductStateRepository.findOne.mockResolvedValue(sampleState);
      MockProductSaleStateRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(productService.createProduct(oneProductDto)).rejects.toThrow('Estado del la compra del producto no encontrado');
    });
  });

  describe('updateProduct', () => {
    it('actualiza un producto existente', async () => {
      const existingProduct = Object.assign({}, sampleProduct);
      MockProductRepository.findOne.mockImplementationOnce(() => Promise.resolve(existingProduct));
      const updatedProduct = Object.assign({}, existingProduct, mockProductUpdate, {
        user: sampleUser,
        product_category: sampleUpdatedCategory,
        product_state: { id_state_product: 2, name: 'Usado' },
        product_sale_state: { id_sale_state_product: 2, name: 'Otro estado' },
        buyer: sampleBuyer,
      });      
      MockUserRepository.findOne.mockImplementationOnce(() => Promise.resolve(sampleBuyer));
      MockProductCategoryRepository.findOne.mockImplementationOnce(() => Promise.resolve(sampleUpdatedCategory));
      MockProductStateRepository.findOne.mockImplementationOnce(() => Promise.resolve({ id_state_product: 2, name: 'Usado' }));
      MockProductSaleStateRepository.findOne.mockImplementationOnce(() => Promise.resolve({ id_sale_state_product: 2, name: 'Otro estado' }));
      const result = await productService.updateProduct(1, mockProductUpdate);
      expect(MockProductRepository.merge).toHaveBeenCalledWith(existingProduct, mockProductUpdate);
      expect(MockProductRepository.save).toHaveBeenCalledWith(existingProduct);
      expect(result).toEqual(updatedProduct);
    });
    it('da un error si no se encuentra el producto a actualizar', async () => {
        MockProductRepository.findOne.mockImplementation(() => Promise.resolve(null));
        await expect(productService.updateProduct(999, mockProductUpdate)).rejects.toThrow('Producto no encontrado');
    });
  });

  describe('deleteProduct', () => {
    it('elimina un producto', async () => {
      MockProductRepository.findOne.mockImplementation(() => Promise.resolve(sampleProduct));
      await productService.deleteProduct(1);
      expect(MockProductRepository.delete).toHaveBeenCalledWith(1);
    });
    it('da un error si el producto no existe', async () => {
      MockProductRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(productService.deleteProduct(2)).rejects.toThrow('Producto no encontrado');
    });
  });

  describe('buyProduct', () => {
    it('realiza una compra exitosa', async () => {
      const productForSale = Object.assign({}, sampleProduct, {
        user: sampleSeller,
        price: 500,
        product_sale_state: { name: 'En venta' },
      });
      MockProductRepository.findOne.mockImplementationOnce(() => Promise.resolve(productForSale));
      MockUserRepository.findOne.mockImplementationOnce(() => Promise.resolve(sampleSeller));
      MockUserRepository.findOne.mockImplementationOnce(() => Promise.resolve(sampleBuyer));
      const soldState = { id_sale_state_product: 2, name: 'Vendido' };
      MockProductSaleStateRepository.findOne.mockImplementationOnce(() => Promise.resolve(soldState));
      const result = await productService.buyProduct(1, 'buyer1', 'user1');
      expect(MockProductRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Compra realizada con exito' });
    });
    it('da un error si el producto no existe', async () => {
      MockProductRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(productService.buyProduct(2, 'buyer1', 'user1')).rejects.toThrow('Producto no encontrado');
    });
    it('da un error si el vendedor no coincide', async () => {
      const productForSale = Object.assign({}, sampleProduct, {
        user: sampleSeller,
        price: 500,
        product_sale_state: { name: 'En venta' },
      });
      MockProductRepository.findOne.mockImplementationOnce(() => Promise.resolve(productForSale));
      MockUserRepository.findOne.mockImplementationOnce(() => Promise.resolve({ id_user: 'user2', balance: 1000, products: [] }));
      await expect(productService.buyProduct(1, 'buyer1', 'user2')).rejects.toThrow('No es tu producto');
    });
    it('da un error si el comprador no tiene saldo suficiente', async () => {
      const productForSale = Object.assign({}, sampleProduct, {
        user: sampleSeller,
        price: 1500,
        product_sale_state: { name: 'En venta' },
      });
      MockProductRepository.findOne.mockImplementationOnce(() => Promise.resolve(productForSale));
      MockUserRepository.findOne.mockImplementationOnce(() => Promise.resolve(sampleSeller));
      const poorBuyer = { id_user: 'buyer1', balance: 100, products: [] };
      MockUserRepository.findOne.mockImplementationOnce(() => Promise.resolve(poorBuyer));
      await expect(productService.buyProduct(1, 'buyer1', 'user1')).rejects.toThrow('Saldo insuficiente');
    });
  });

  describe('swapProduct', () => {
    it('realiza un intercambio exitoso', async () => {
      const productA = Object.assign({}, sampleProduct, {
        id_product: 1,
        user: sampleSeller,
        product_sale_state: { name: 'En venta' },
        exchangedWith: null,
      });
      const productB = Object.assign({}, sampleProductSwaped, {
        id_product: 2,
        user: { id_user: 'user2', balance: 500, products: [] },
        product_sale_state: { name: 'En venta' },
        exchangedWith: null,
      });
      MockProductRepository.findOne
        .mockImplementationOnce(() => Promise.resolve(productA))
        .mockImplementationOnce(() => Promise.resolve(productB));
      const soldState = { id_sale_state_product: 2, name: 'Vendido' };
      MockProductSaleStateRepository.findOne.mockImplementationOnce(() => Promise.resolve(soldState));
      MockUserRepository.findOne.mockImplementationOnce(() => Promise.resolve(sampleSeller)).mockImplementationOnce(() => Promise.resolve({ id_user: 'user2', balance: 500, products: [] }));
      const result = await productService.swapProduct(1, 2, 'buyer1', 'user1');
      expect(MockProductRepository.save).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ message: 'Intercambio realizado con exito' });
    });
    it('da un error si el producto no se encuentra', async () => {
      MockProductRepository.findOne.mockImplementation(() => Promise.resolve(null));
      await expect(productService.swapProduct(2, 3, 'buyer1', 'user1')).rejects.toThrow('Producto no encontrado');
    });
    it('da un error si el producto intercambiado no se encuentra', async () => {
      MockProductRepository.findOne
        .mockImplementationOnce(() => Promise.resolve(sampleProduct))
        .mockImplementationOnce(() => Promise.resolve(null));
      await expect(productService.swapProduct(1, 3, 'buyer1', 'user1')).rejects.toThrow('Producto intercambiado no encontrado');
    });
    it('da un error si se intenta intercambiar el mismo producto', async () => {
      const productSame = Object.assign({}, sampleProduct, {
        id_product: 1,
        user: sampleSeller,
        product_sale_state: { name: 'En venta' },
        exchangedWith: null,
      });
      MockProductRepository.findOne
        .mockImplementationOnce(() => Promise.resolve(productSame))
        .mockImplementationOnce(() => Promise.resolve(productSame));
      MockUserRepository.findOne.mockImplementationOnce(() => Promise.resolve(sampleSeller));
      await expect(productService.swapProduct(1, 1, 'buyer1', 'user1')).rejects.toThrow('No puedes intercambiar el mismo producto');
    });
  });
});
