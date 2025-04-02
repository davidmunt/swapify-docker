import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryService } from './product_category.service';
import { ProductCategory } from './product_category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './product_category.dto';

const oneProductCategoryDto: CreateProductCategoryDto = {
  name: 'Instrumentos Musicales',
  description: 'Categoria para guitarras, pianos, baterias y otros instrumentos musicales.'
};

const mockProductCategoryUpdate: UpdateProductCategoryDto = {
  name: 'Actualizado',
  description: 'Categoria actualizada'
};

describe('ProductCategoryService', () => {
  let productCategoryService: ProductCategoryService;

  const MockProductCategoryRepository = {
    find: jest.fn(() =>
      Promise.resolve([Object.assign({}, oneProductCategoryDto, { id_category_product: 1 })])
    ),
    findOne: jest.fn(() =>
      Promise.resolve(Object.assign({}, oneProductCategoryDto, { id_category_product: 1 }))
    ),
    findOneBy: jest.fn((criteria) => {
      if (criteria.id_category_product === 1) {
        return Promise.resolve(Object.assign({}, oneProductCategoryDto, { id_category_product: 1 }));
      }
      if (criteria.name && criteria.name === oneProductCategoryDto.name) {
        return Promise.resolve(Object.assign({}, oneProductCategoryDto, { id_category_product: 1 }));
      }
      return Promise.resolve(null);
    }),
    create: jest.fn((data: Partial<ProductCategory>) => {
      const result = Object.assign({}, data);
      result.id_category_product = 1;
      return result;
    }),
    save: jest.fn((data: Partial<ProductCategory>) => {
      const result = Object.assign({}, data);
      result.id_category_product = 1;
      return Promise.resolve(result);
    }),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve({ affected: 1 }))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCategoryService,
        { provide: getRepositoryToken(ProductCategory), useValue: MockProductCategoryRepository }
      ]
    }).compile();
    productCategoryService = module.get<ProductCategoryService>(ProductCategoryService);
  });

  it('debe estar definido', () => {
    expect(productCategoryService).toBeDefined();
  });

  describe('getAllProductCategory', () => {
    it('devuelve todas las categorias de producto', async () => {
      const result = await productCategoryService.getAllProductCategory();
      expect(result).toEqual([Object.assign({}, oneProductCategoryDto, { id_category_product: 1 })]);
      expect(MockProductCategoryRepository.find).toHaveBeenCalledWith({ relations: ['products'] });
    });
  });

  describe('getProductCategory', () => {
    it('devuelve una categoria de producto por id', async () => {
      const result = await productCategoryService.getProductCategory(1);
      expect(result).toEqual(Object.assign({}, oneProductCategoryDto, { id_category_product: 1 }));
      expect(MockProductCategoryRepository.findOne).toHaveBeenCalledWith({ where: { id_category_product: 1 }, relations: ['products'] });
    });
    it('da un error si no se encuentra la categoria de producto', async () => {
      MockProductCategoryRepository.findOne.mockResolvedValueOnce(null);
      await expect(productCategoryService.getProductCategory(2)).rejects.toThrow('Categoría de producto no encontrada');
    });
  });

  describe('createProductCategory', () => {
    it('crea una nueva categoria de producto', async () => {
      MockProductCategoryRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await productCategoryService.createProductCategory(oneProductCategoryDto);
      expect(MockProductCategoryRepository.create).toHaveBeenCalledWith(oneProductCategoryDto);
      expect(MockProductCategoryRepository.save).toHaveBeenCalled();
      expect(result).toEqual(Object.assign({}, oneProductCategoryDto, { id_category_product: 1 }));
    });
    it('da un error de conflicto si la categoria ya existe', async () => {
      MockProductCategoryRepository.findOneBy.mockResolvedValueOnce(Object.assign({}, oneProductCategoryDto, { id_category_product: 1 }));
      await expect(productCategoryService.createProductCategory(oneProductCategoryDto)).rejects.toThrow('Esta categoría ya existe');
    });
  });

  describe('updateProductCategory', () => {
    it('actualiza una categoria de producto existente', async () => {
      MockProductCategoryRepository.findOneBy.mockResolvedValueOnce(Object.assign({}, oneProductCategoryDto, { id_category_product: 1 }));
      MockProductCategoryRepository.findOne.mockResolvedValueOnce(Object.assign({}, oneProductCategoryDto, mockProductCategoryUpdate, { id_category_product: 1 }));
      const result = await productCategoryService.updateProductCategory(1, mockProductCategoryUpdate);
      expect(MockProductCategoryRepository.update).toHaveBeenCalledWith(1, mockProductCategoryUpdate);
      expect(MockProductCategoryRepository.findOne).toHaveBeenCalledWith({ where: { id_category_product: 1 }, relations: ['products'] });
      expect(result).toEqual(Object.assign({}, oneProductCategoryDto, mockProductCategoryUpdate, { id_category_product: 1 }));
    });
    it('da un error si no se encuentra la categoria a actualizar', async () => {
      MockProductCategoryRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(productCategoryService.updateProductCategory(2, mockProductCategoryUpdate)).rejects.toThrow('Categoría de producto no encontrada');
    });
  });

  describe('deleteProductCategory', () => {
    it('elimina una categoria de producto', async () => {
      MockProductCategoryRepository.findOneBy.mockResolvedValueOnce(Object.assign({}, oneProductCategoryDto, { id_category_product: 1 }));
      const result = await productCategoryService.deleteProductCategory(1);
      expect(MockProductCategoryRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Categoría de producto eliminada correctamente' });
    });
    it('da un error si no se encuentra la categoria a eliminar', async () => {
      MockProductCategoryRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(productCategoryService.deleteProductCategory(2)).rejects.toThrow('Categoría de producto no encontrada');
    });
  });
});
