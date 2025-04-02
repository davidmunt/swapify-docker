import { Test, TestingModule } from '@nestjs/testing';
import { ProductStateService } from './product_state.service';
import { ProductState } from './product_state.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductStateDto, UpdateProductStateDto } from './product_state.dto';

const oneProductStateDto: CreateProductStateDto = {
  name: 'Reacondicionado',
  description: 'Este producto ha sido restaurado y esta en optimas condiciones de funcionamiento.'
};

const mockProductStateUpdate: UpdateProductStateDto = {
  name: 'Actualizado',
  description: 'Producto actualizado'
};

describe('ProductStateService', () => {
  let productStateService: ProductStateService;

  const MockProductStateRepository = {
    find: jest.fn(() =>
      Promise.resolve([Object.assign({}, oneProductStateDto, { id_state_product: 1 })])
    ),
    findOne: jest.fn(() =>
      Promise.resolve(Object.assign({}, oneProductStateDto, { id_state_product: 1 }))
    ),
    findOneBy: jest.fn((criteria) => {
      if (criteria.id_state_product === 1) {
        return Promise.resolve(Object.assign({}, oneProductStateDto, { id_state_product: 1 }));
      }
      if (criteria.name && criteria.name === oneProductStateDto.name) {
        return Promise.resolve(Object.assign({}, oneProductStateDto, { id_state_product: 1 }));
      }
      return Promise.resolve(null);
    }),
    create: jest.fn((data: Partial<ProductState>) => {
      const result = Object.assign({}, data);
      result.id_state_product = 1;
      return result;
    }),
    save: jest.fn((data: Partial<ProductState>) => {
      const result = Object.assign({}, data);
      result.id_state_product = 1;
      return Promise.resolve(result);
    }),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve({ affected: 1 }))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductStateService,
        { provide: getRepositoryToken(ProductState), useValue: MockProductStateRepository }
      ]
    }).compile();
    productStateService = module.get<ProductStateService>(ProductStateService);
  });

  it('debe estar definido', () => {
    expect(productStateService).toBeDefined();
  });

  describe('getAllProductState', () => {
    it('devuelve todos los estados de producto', async () => {
      const result = await productStateService.getAllProductState();
      expect(result).toEqual([Object.assign({}, oneProductStateDto, { id_state_product: 1 })]);
      expect(MockProductStateRepository.find).toHaveBeenCalledWith({ relations: ['products'] });
    });
  });

  describe('getProductState', () => {
    it('devuelve un estado de producto por id', async () => {
      const result = await productStateService.getProductState(1);
      expect(result).toEqual(Object.assign({}, oneProductStateDto, { id_state_product: 1 }));
      expect(MockProductStateRepository.findOne).toHaveBeenCalledWith({ where: { id_state_product: 1 }, relations: ['products'] });
    });
    it('da un error si no se encuentra el estado de producto', async () => {
      MockProductStateRepository.findOne.mockResolvedValueOnce(null);
      await expect(productStateService.getProductState(2)).rejects.toThrow('Estado del producto no encontrado');
    });
  });

  describe('createProductState', () => {
    it('crea un nuevo estado de producto', async () => {
      MockProductStateRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await productStateService.createProductState(oneProductStateDto);
      expect(MockProductStateRepository.create).toHaveBeenCalledWith(oneProductStateDto);
      expect(MockProductStateRepository.save).toHaveBeenCalled();
      expect(result).toEqual(Object.assign({}, oneProductStateDto, { id_state_product: 1 }));
    });
    it('da un error de conflicto si el estado ya existe', async () => {
      MockProductStateRepository.findOneBy.mockResolvedValueOnce(Object.assign({}, oneProductStateDto, { id_state_product: 1 }));
      await expect(productStateService.createProductState(oneProductStateDto)).rejects.toThrow('Este estado ya existe');
    });
  });

  describe('updateProductState', () => {
    it('actualiza un estado de producto existente', async () => {
      MockProductStateRepository.findOneBy.mockResolvedValueOnce(Object.assign({}, oneProductStateDto, { id_state_product: 1 }));
      MockProductStateRepository.findOne.mockResolvedValueOnce(Object.assign({}, oneProductStateDto, mockProductStateUpdate, { id_state_product: 1 }));
      const result = await productStateService.updateProductState(1, mockProductStateUpdate);
      expect(MockProductStateRepository.update).toHaveBeenCalledWith(1, mockProductStateUpdate);
      expect(MockProductStateRepository.findOne).toHaveBeenCalledWith({ where: { id_state_product: 1 }, relations: ['products'] });
      expect(result).toEqual(Object.assign({}, oneProductStateDto, mockProductStateUpdate, { id_state_product: 1 }));
    });
    it('da un error si no se encuentra el estado a actualizar', async () => {
      MockProductStateRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(productStateService.updateProductState(2, mockProductStateUpdate)).rejects.toThrow('Estado del producto no encontrado');
    });
  });

  describe('deleteProductState', () => {
    it('elimina un estado de producto', async () => {
      MockProductStateRepository.findOneBy.mockResolvedValueOnce(Object.assign({}, oneProductStateDto, { id_state_product: 1 }));
      const result = await productStateService.deleteProductState(1);
      expect(MockProductStateRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Estado del producto eliminado' });
    });
    it('da un error si no se encuentra el estado a eliminar', async () => {
      MockProductStateRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(productStateService.deleteProductState(2)).rejects.toThrow('Estado del producto no encontrado');
    });
  });
});
