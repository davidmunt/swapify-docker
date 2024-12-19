import { Test, TestingModule } from '@nestjs/testing';
import { InventariService } from './inventari.service';
import { Inventari } from './inventari.entity';
import { UtilsService } from '../utils/utils.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateInventariDto, UpdateInventariDto } from './inventari.dto';

const oneInventariDto: CreateInventariDto = {
  num_serie: 'ABC123',
  brand: 'Marca A',
  model: 'Modelo A',
  GVA_cod_article: 12345,
  GVA_description_cod_articulo: 'Descripción del artículo A',
  status: 'disponible',
  id_type: 1,
  id_classroom: 1,
};

const mockInventariUpdate: UpdateInventariDto = {
  num_serie: 'ABC123',
  brand: 'Marca A',
  model: 'Modelo A',
  GVA_cod_article: 12345,
  GVA_description_cod_articulo: 'Descripción del artículo A',
  status: 'disponible',
  id_type: 1,
  id_classroom: 1,
};

describe('InventariService', () => {
  let inventariService: InventariService;

  const MockInventariRepository = {
    find: jest.fn(() => [oneInventariDto]),
    findOne: jest.fn(() => oneInventariDto),
    create: jest.fn((inventari: Partial<Inventari>) => ({
      ...oneInventariDto,
      ...inventari,
    })),
    save: jest.fn((inventari: Partial<Inventari>) => ({
      ...oneInventariDto,
      ...inventari,
    })),
    update: jest.fn(() => Promise.resolve()),
    findOneBy: jest.fn((criteria) => {
      if (criteria.id_inventory === 1) {
        return Promise.resolve({ ...oneInventariDto, ...mockInventariUpdate });
      }
      return Promise.resolve(null);
    }),
    delete: jest.fn(() => Promise.resolve({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventariService,
        UtilsService,
        {
          provide: getRepositoryToken(Inventari),
          useValue: MockInventariRepository,
        },
      ],
    }).compile();

    inventariService = module.get<InventariService>(InventariService);
  });

  it('should be defined', () => {
    expect(inventariService).toBeDefined();
  });

  describe('createInventari', () => {
    it('should create a new inventory item', async () => {
      const result = await inventariService.createInventari(oneInventariDto);
      expect(result).toEqual({ message: 'Inventario creado' });
      expect(MockInventariRepository.create).toHaveBeenCalledWith({
        ...oneInventariDto,
        fk_inventary_type: { id_type: oneInventariDto.id_type },
        fk_classroom: { id_classroom: oneInventariDto.id_classroom },
      });
      expect(MockInventariRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateInventari', () => {
    it('should update an inventory item', async () => {
      const result = await inventariService.updateInventari(
        1,
        mockInventariUpdate,
      );

      expect(MockInventariRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          ...mockInventariUpdate,
          fk_inventary_type: { id_type: mockInventariUpdate.id_type },
          fk_classroom: { id_classroom: mockInventariUpdate.id_classroom },
        }),
      );
      expect(MockInventariRepository.findOneBy).toHaveBeenCalledWith({
        id_inventory: 1,
      });
      expect(result).toEqual({ ...oneInventariDto, ...mockInventariUpdate });
    });
  });

  describe('getInventariAll', () => {
    it('should return an array of inventaris', async () => {
      const result = await inventariService.getInventariAll('false');
      expect(result).toEqual([oneInventariDto]);
    });
  });

  describe('getInventari', () => {
    it('should return a specific inventari by ID', async () => {
      const result = await inventariService.getInventari(1, 'false');
      expect(result).toEqual(oneInventariDto);
      expect(MockInventariRepository.findOneBy).toHaveBeenCalledWith({
        id_inventory: 1,
      });
    });
  });

  describe('deleteInventari', () => {
    it('should delete an inventari successfully', async () => {
      const result = await inventariService.deleteInventari(1);
      expect(result).toEqual({ message: 'Inventario eliminado' });
      expect(MockInventariRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
