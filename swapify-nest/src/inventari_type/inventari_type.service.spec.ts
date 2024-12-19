import { Test, TestingModule } from '@nestjs/testing';
import { InventariTypeService } from './inventari_type.service';
import { Inventari_type } from './inventari_type.entity';
import { Inventari } from '../inventari/inventari.entity';
import { UtilsService } from '../utils/utils.service';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockInventari = Object.assign(new Inventari(), {
  id_inventory: 1,
  num_serie: '123ABC',
  id_type: 1,
  brand: 'Toshiba',
  model: '7354',
  GVA_cod_article: 123456,
  GVA_description_cod_articulo: 'Descripció',
  status: 'En uso',
  id_classroom: 101,
  fk_inventary_type: {} as Inventari_type,
});

const mockInventariType = {
  id_type: 1,
  description: 'Electrónicos',
  fk_inventari: [mockInventari],
};

const inventariTypeArray = [
  { ...mockInventariType },
  {
    id_type: 2,
    description: 'PC',
    fk_inventari: [],
  },
];

const oneInventariType = { ...mockInventariType };

const updateInventariType = {
  id_type: 1,
  description: 'Electrónicos actualizados',
  fk_inventari: [mockInventari],
};

const deleteInventariType = {
  id_type: 2,
  description: 'PC',
  fk_inventari: [],
};

describe('InventariTypeService', () => {
  let inventariTypeService: InventariTypeService;

  const mockRepository = {
    find: jest.fn(() => inventariTypeArray),
    findOneBy: jest.fn(() => oneInventariType),
    create: jest.fn(() => oneInventariType),
    findOne: jest.fn(() => oneInventariType),
    delete: jest.fn(() => deleteInventariType),
    save: jest.fn(() => updateInventariType),
    merge: jest.fn(() => updateInventariType),
    update: jest.fn((id_type, updateData) => {
      if (id_type === 1) {
        oneInventariType.description = updateData.description;
      }
      return Promise.resolve();
    }),
  };

  const mockUtilsService = {
    convertJSONtoXML: jest.fn(
      () => '<Inventory_types><type>XML Content</type></Inventory_types>',
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventariTypeService,
        {
          provide: getRepositoryToken(Inventari_type),
          useValue: mockRepository,
        },
        {
          provide: UtilsService,
          useValue: mockUtilsService,
        },
      ],
    }).compile();

    inventariTypeService =
      module.get<InventariTypeService>(InventariTypeService);
  });

  it('should be defined', () => {
    expect(inventariTypeService).toBeDefined();
  });

  describe('createInventariType', () => {
    it('should create a new inventari type', async () => {
      const mockInventariTypeToCreate = {
        id_type: 4,
        description: 'Electrodomésticos',
        fk_inventari: [],
      };

      const result = await inventariTypeService.createInventariType(
        mockInventariTypeToCreate,
      );
      expect(result).toEqual({
        message: 'Tipo de inventario creado satisfactoriamente',
      });
    });
  });

  describe('getInventariType', () => {
    it('should return an inventari type', async () => {
      const result = await inventariTypeService.getInventariType(1, 'false');
      expect(typeof result).toBe('object');
    });

    it('should return an XML string when format is set to "xml"', async () => {
      const result = await inventariTypeService.getInventariType(1, 'xml');
      expect(typeof result).toBe('string');
    });
  });

  describe('getAllInventariType', () => {
    it('should return an inventari type', async () => {
      const result = await inventariTypeService.getAllInventariType();
      expect(typeof result).toBe('object');
    });

    it('should return an XML string when format is set to "xml"', async () => {
      const result = await inventariTypeService.getAllInventariType('xml');
      expect(typeof result).toBe('string');
    });
  });

  describe('updateInventariType', () => {
    it('should update an inventari type', async () => {
      const result = await inventariTypeService.updateInventariType(
        1,
        updateInventariType,
      );
      expect(result).toEqual(updateInventariType);
    });
  });

  describe('deleteInventariType', () => {
    it('should delete an inventari type successfully', async () => {
      const mockDeleteResponse = {
        message: 'Tipo de inventario eliminado satisfactoriamente',
      };
      jest
        .spyOn(inventariTypeService, 'deleteInventariType')
        .mockResolvedValue(mockDeleteResponse);

      const result = await inventariTypeService.deleteInventariType(1);
      expect(result).toEqual(mockDeleteResponse);
      expect(inventariTypeService.deleteInventariType).toHaveBeenCalledWith(1);
    });
  });
});
