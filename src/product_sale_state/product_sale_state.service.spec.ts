import { Test, TestingModule } from '@nestjs/testing';
import { ProductSaleStateService } from './product_sale_state.service';
import { ProductSaleState } from './product_sale_state.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductSaleStateDto, UpdateProductSaleStateDto } from './product_sale_state.dto';

const oneProductSaleStateDto: CreateProductSaleStateDto = {
  name: 'Subasta',
  description: 'Este producto esta en subasta y los usuarios pueden ofertar por el.'
};

const mockProductSaleStateUpdate: UpdateProductSaleStateDto = {
  name: 'Actualizado',
  description: 'Estado actualizado'
};

describe('ProductSaleStateService', () => {
  let productSaleStateService: ProductSaleStateService;

  const MockProductSaleStateRepository = {
    find: jest.fn(() =>
      Promise.resolve([Object.assign({}, oneProductSaleStateDto, { id_sale_state_product: 1 })])
    ),
    findOne: jest.fn(() =>
      Promise.resolve(Object.assign({}, oneProductSaleStateDto, { id_sale_state_product: 1 }))
    ),
    findOneBy: jest.fn((criteria) => {
      if (criteria.id_sale_state_product === 1) {
        return Promise.resolve(Object.assign({}, oneProductSaleStateDto, { id_sale_state_product: 1 }));
      }
      if (criteria.name && criteria.name === oneProductSaleStateDto.name) {
        return Promise.resolve(Object.assign({}, oneProductSaleStateDto, { id_sale_state_product: 1 }));
      }
      return Promise.resolve(null);
    }),
    create: jest.fn((data: Partial<ProductSaleState>) => {
      const result = Object.assign({}, data);
      result.id_sale_state_product = 1;
      return result;
    }),
    save: jest.fn((data: Partial<ProductSaleState>) => {
      const result = Object.assign({}, data);
      result.id_sale_state_product = 1;
      return Promise.resolve(result);
    }),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve({ affected: 1 }))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductSaleStateService,
        { provide: getRepositoryToken(ProductSaleState), useValue: MockProductSaleStateRepository }
      ]
    }).compile();
    productSaleStateService = module.get<ProductSaleStateService>(ProductSaleStateService);
  });

  it('debe estar definido', () => {
    expect(productSaleStateService).toBeDefined();
  });

  describe('getAllProductSaleState', () => {
    it('devuelve todos los estados de venta de producto', async () => {
      const result = await productSaleStateService.getAllProductSaleState();
      expect(result).toEqual([Object.assign({}, oneProductSaleStateDto, { id_sale_state_product: 1 })]);
      expect(MockProductSaleStateRepository.find).toHaveBeenCalledWith({ relations: ['products'] });
    });
  });

  describe('getProductSaleState', () => {
    it('devuelve un estado de venta de producto por id', async () => {
      const result = await productSaleStateService.getProductSaleState(1);
      expect(result).toEqual(Object.assign({}, oneProductSaleStateDto, { id_sale_state_product: 1 }));
      expect(MockProductSaleStateRepository.findOne).toHaveBeenCalledWith({ where: { id_sale_state_product: 1 }, relations: ['products'] });
    });
    it('da un error si no se encuentra el estado de venta del producto', async () => {
      MockProductSaleStateRepository.findOne.mockResolvedValueOnce(null);
      await expect(productSaleStateService.getProductSaleState(2)).rejects.toThrow('Estado de la venta del producto no encontrado');
    });
  });

  describe('createProductSaleState', () => {
    it('crea un nuevo estado de venta de producto', async () => {
      MockProductSaleStateRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await productSaleStateService.createProductSaleState(oneProductSaleStateDto);
      expect(MockProductSaleStateRepository.create).toHaveBeenCalledWith(oneProductSaleStateDto);
      expect(MockProductSaleStateRepository.save).toHaveBeenCalled();
      expect(result).toEqual(Object.assign({}, oneProductSaleStateDto, { id_sale_state_product: 1 }));
    });
    it('da un error de conflicto si el estado de venta ya existe', async () => {
      MockProductSaleStateRepository.findOneBy.mockResolvedValueOnce(Object.assign({}, oneProductSaleStateDto, { id_sale_state_product: 1 }));
      await expect(productSaleStateService.createProductSaleState(oneProductSaleStateDto)).rejects.toThrow('Este estado de la venta ya existe');
    });
  });

  describe('updateProductSaleState', () => {
    it('actualiza un estado de venta de producto existente', async () => {
      MockProductSaleStateRepository.findOneBy.mockResolvedValueOnce(Object.assign({}, oneProductSaleStateDto, { id_sale_state_product: 1 }));
      MockProductSaleStateRepository.findOne.mockResolvedValueOnce(Object.assign({}, oneProductSaleStateDto, mockProductSaleStateUpdate, { id_sale_state_product: 1 }));
      const result = await productSaleStateService.updateProductSaleState(1, mockProductSaleStateUpdate);
      expect(MockProductSaleStateRepository.update).toHaveBeenCalledWith(1, mockProductSaleStateUpdate);
      expect(MockProductSaleStateRepository.findOne).toHaveBeenCalledWith({ where: { id_sale_state_product: 1 }, relations: ['products'] });
      expect(result).toEqual(Object.assign({}, oneProductSaleStateDto, mockProductSaleStateUpdate, { id_sale_state_product: 1 }));
    });
    it('da un error si no se encuentra el estado de venta a actualizar', async () => {
      MockProductSaleStateRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(productSaleStateService.updateProductSaleState(2, mockProductSaleStateUpdate)).rejects.toThrow('Estado de la venta del producto no encontrado');
    });
  });

  describe('deleteProductSaleState', () => {
    it('elimina un estado de venta de producto', async () => {
      MockProductSaleStateRepository.findOneBy.mockResolvedValueOnce(Object.assign({}, oneProductSaleStateDto, { id_sale_state_product: 1 }));
      const result = await productSaleStateService.deleteProductSaleState(1);
      expect(MockProductSaleStateRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Estado de la venta del producto eliminado' });
    });
    it('da un error si no se encuentra el estado de venta a eliminar', async () => {
      MockProductSaleStateRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(productSaleStateService.deleteProductSaleState(2)).rejects.toThrow('Estado de la venta del producto no encontrado');
    });
  });
});
