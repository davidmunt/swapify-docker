import { Test, TestingModule } from '@nestjs/testing';
import { ProductLikeService } from './product_like.service';
import { ProductLike } from './product_like.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';

const sampleProduct = {
  id_product: 1,
  product_brand: 'MarcaX',
  product_model: 'ModeloY',
  user: { id_user: 'user1', name: 'Usuario1', tokenNotifications: 'token123' }
};

const sampleUser = {
  id_user: 'user2',
  name: 'Usuario2'
};

const sampleLike = { id: 1 };

describe('ProductLikeService', () => {
  let productLikeService: ProductLikeService;

  const MockProductLikeRepository = {
    findOne: jest.fn(),
    create: jest.fn((data: any) => {
      const result = Object.assign({}, data);
      result.id = 1;
      return result;
    }),
    save: jest.fn((data: any) => Promise.resolve(data)),
    delete: jest.fn(() => Promise.resolve({ affected: 1 }))
  };

  const MockProductRepository = {
    findOne: jest.fn()
  };

  const MockUserRepository = {
    findOne: jest.fn()
  };

  const MockNotificationService = {
    sendNotificationLikeProduct: jest.fn(() => Promise.resolve())
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductLikeService,
        { provide: getRepositoryToken(ProductLike), useValue: MockProductLikeRepository },
        { provide: getRepositoryToken(Product), useValue: MockProductRepository },
        { provide: getRepositoryToken(User), useValue: MockUserRepository },
        { provide: NotificationService, useValue: MockNotificationService }
      ]
    }).compile();
    productLikeService = module.get<ProductLikeService>(ProductLikeService);
  });

  describe('likeProduct', () => {
    it('agrega like exitosamente', async () => {
      MockProductRepository.findOne.mockResolvedValueOnce(sampleProduct);
      MockUserRepository.findOne.mockResolvedValueOnce(sampleUser);
      MockProductLikeRepository.findOne.mockResolvedValueOnce(null);
      await productLikeService.likeProduct(1, 'user2');
      expect(MockProductLikeRepository.create).toHaveBeenCalled();
      expect(MockProductLikeRepository.save).toHaveBeenCalled();
      expect(MockNotificationService.sendNotificationLikeProduct).toHaveBeenCalled();
    });

    it('lanza error si el producto no existe', async () => {
      MockProductRepository.findOne.mockResolvedValueOnce(null);
      await expect(productLikeService.likeProduct(1, 'user2')).rejects.toThrow('Producto no encontrado');
    });

    it('lanza error si se intenta dar like al propio producto', async () => {
      const ownProduct = Object.assign({}, sampleProduct, { user: { id_user: 'user1', name: 'Usuario1', tokenNotifications: 'token123' } });
      MockProductRepository.findOne.mockResolvedValueOnce(ownProduct);
      await expect(productLikeService.likeProduct(1, 'user1')).rejects.toThrow('No puedes dar like a tu propio producto');
    });

    it('lanza error si el usuario no existe', async () => {
      MockProductRepository.findOne.mockResolvedValueOnce(sampleProduct);
      MockUserRepository.findOne.mockResolvedValueOnce(null);
      await expect(productLikeService.likeProduct(1, 'user2')).rejects.toThrow('Usuario no encontrado');
    });

    it('lanza error si el like ya existe', async () => {
      MockProductRepository.findOne.mockResolvedValueOnce(sampleProduct);
      MockUserRepository.findOne.mockResolvedValueOnce(sampleUser);
      MockProductLikeRepository.findOne.mockResolvedValueOnce({ id: 1 });
      await expect(productLikeService.likeProduct(1, 'user2')).rejects.toThrow('El usuario ya ha dado like a este producto');
    });
  });

  describe('unlikeProduct', () => {
    it('elimina el like exitosamente', async () => {
      MockProductLikeRepository.findOne.mockResolvedValueOnce(sampleLike);
      await productLikeService.unlikeProduct(1, 'user2');
      expect(MockProductLikeRepository.delete).toHaveBeenCalledWith(1);
    });

    it('lanza error si el like no existe', async () => {
      MockProductLikeRepository.findOne.mockResolvedValueOnce(null);
      await expect(productLikeService.unlikeProduct(1, 'user2')).rejects.toThrow('Like no encontrado');
    });
  });
});
