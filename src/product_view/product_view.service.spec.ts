import { Test, TestingModule } from '@nestjs/testing';
import { ProductViewService } from './product_view.service';
import { ProductView } from './product_view.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { SaveProductViewDto } from './product_view.dto';

const sampleUser = { id_user: 'user1', name: 'Usuario1' };
const sampleProduct = { id_product: 1, product_brand: 'MarcaX', product_model: 'ModeloY' };
const sampleProductView = { id: 1, user: sampleUser, product: sampleProduct, viewed_at: new Date() };

const sampleSaveProductViewDto: SaveProductViewDto = {
  id_user: 'user1',
  id_product: 1
};

describe('ProductViewService', () => {
  let productViewService: ProductViewService;

  const MockProductViewRepository = {
    find: jest.fn(() =>
      Promise.resolve([sampleProductView])
    ),
    create: jest.fn((data: any) => {
      const result = Object.assign({}, data);
      result.id = 1;
      result.viewed_at = new Date();
      return result;
    }),
    save: jest.fn((data: any) => Promise.resolve(data))
  };

  const MockUserRepository = {
    findOne: jest.fn()
  };

  const MockProductRepository = {
    findOne: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductViewService,
        { provide: getRepositoryToken(ProductView), useValue: MockProductViewRepository },
        { provide: getRepositoryToken(User), useValue: MockUserRepository },
        { provide: getRepositoryToken(Product), useValue: MockProductRepository }
      ]
    }).compile();
    productViewService = module.get<ProductViewService>(ProductViewService);
  });

  describe('getAllProductViews', () => {
    it('devuelve todas las vistas de producto', async () => {
      const result = await productViewService.getAllProductViews();
      expect(result).toEqual([sampleProductView]);
      expect(MockProductViewRepository.find).toHaveBeenCalledWith({ relations: ['product', 'user'] });
    });
  });

  describe('saveProductView', () => {
    it('registra una vista de producto correctamente', async () => {
      MockUserRepository.findOne.mockResolvedValueOnce(sampleUser);
      MockProductRepository.findOne.mockResolvedValueOnce(sampleProduct);
      const createdView = Object.assign({ user: sampleUser, product: sampleProduct }, { id: 1, viewed_at: new Date() });
      MockProductViewRepository.create.mockReturnValueOnce(createdView);
      MockProductViewRepository.save.mockResolvedValueOnce(createdView);
      const result = await productViewService.saveProductView(sampleSaveProductViewDto);
      expect(MockUserRepository.findOne).toHaveBeenCalledWith({ where: { id_user: sampleSaveProductViewDto.id_user } });
      expect(MockProductRepository.findOne).toHaveBeenCalledWith({ where: { id_product: sampleSaveProductViewDto.id_product } });
      expect(MockProductViewRepository.create).toHaveBeenCalledWith({ user: sampleUser, product: sampleProduct });
      expect(MockProductViewRepository.save).toHaveBeenCalledWith(createdView);
      expect(result).toEqual(createdView);
    });

    it('lanza error si el usuario no existe', async () => {
      MockUserRepository.findOne.mockResolvedValueOnce(null);
      await expect(productViewService.saveProductView(sampleSaveProductViewDto)).rejects.toThrow('Usuario no encontrado');
    });

    it('lanza error si el producto no existe', async () => {
      MockUserRepository.findOne.mockResolvedValueOnce(sampleUser);
      MockProductRepository.findOne.mockResolvedValueOnce(null);
      await expect(productViewService.saveProductView(sampleSaveProductViewDto)).rejects.toThrow('Producto no encontrado');
    });
  });
});
