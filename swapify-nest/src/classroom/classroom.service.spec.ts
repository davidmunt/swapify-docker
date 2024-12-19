import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomService } from './classroom.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Classroom } from './classroom.entity';
import { UtilsService } from '../utils/utils.service';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

describe('ClassroomService', () => {
  let service: ClassroomService;
  let classroomRepository: Repository<Classroom>;

  const mockClassroomRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    merge: jest.fn(),
  };

  const mockUtilsService = {
    convertJSONtoXML: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassroomService,
        {
          provide: getRepositoryToken(Classroom),
          useValue: mockClassroomRepository,
        },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compile();

    service = module.get<ClassroomService>(ClassroomService);
    classroomRepository = module.get<Repository<Classroom>>(
      getRepositoryToken(Classroom),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllClassroom', () => {
    it('should return an array of classrooms', async () => {
      const result = [
        { id_classroom: 1, description: 'piso 1', fk_inventari: [] },
      ];
      jest.spyOn(classroomRepository, 'find').mockResolvedValue(result);

      expect(await service.getAllClassroom()).toBe(result);
    });

    it('should return XML when xml flag is true', async () => {
      const result = [
        { id_classroom: 1, description: 'piso 1', fk_inventari: [] },
      ];
      jest.spyOn(classroomRepository, 'find').mockResolvedValue(result);
      jest
        .spyOn(mockUtilsService, 'convertJSONtoXML')
        .mockReturnValue('<root></root>');

      expect(await service.getAllClassroom('true')).toBe('<root></root>');
    });
  });

  describe('getClassroom', () => {
    it('should return a classroom', async () => {
      const result = {
        id_classroom: 1,
        description: 'piso 1',
        fk_inventari: [],
      };
      jest.spyOn(classroomRepository, 'findOneBy').mockResolvedValue(result);

      expect(await service.getClassroom(1)).toBe(result);
    });

    it('should throw an exception when classroom is not found', async () => {
      jest.spyOn(classroomRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.getClassroom(1)).rejects.toThrow(HttpException);
    });
  });

  describe('createClassroom', () => {
    it('should create a new classroom', async () => {
      const classroomData = {
        id_classroom: 1,
        description: 'piso 1',
        fk_inventari: [],
      };
      jest.spyOn(classroomRepository, 'create').mockReturnValue(classroomData);
      jest.spyOn(classroomRepository, 'save').mockResolvedValue(classroomData);

      const result = await service.createClassroom(classroomData);

      expect(result).toEqual({ message: 'Aula creada' });
      expect(classroomRepository.create).toHaveBeenCalledWith(classroomData);
      expect(classroomRepository.save).toHaveBeenCalledWith(classroomData);
    });
  });

  describe('updateClassroom', () => {
    it('should update a classroom', async () => {
      const existingClassroom = {
        id_classroom: 1,
        description: 'piso 1',
        fk_inventari: [],
      };
      const updatedData = { description: 'piso 2' };
      jest
        .spyOn(classroomRepository, 'findOneBy')
        .mockResolvedValue(existingClassroom);
      jest
        .spyOn(classroomRepository, 'merge')
        .mockReturnValue({ ...existingClassroom, ...updatedData });
      jest
        .spyOn(classroomRepository, 'save')
        .mockResolvedValue({ ...existingClassroom, ...updatedData });

      const result = await service.updateClassroom(1, updatedData);

      expect(result).toEqual({ ...existingClassroom, ...updatedData });
      expect(classroomRepository.findOneBy).toHaveBeenCalledWith({
        id_classroom: 1,
      });
      expect(classroomRepository.merge).toHaveBeenCalledWith(
        existingClassroom,
        updatedData,
      );
      expect(classroomRepository.save).toHaveBeenCalled();
    });

    it('should throw an exception when classroom is not found', async () => {
      jest.spyOn(classroomRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.updateClassroom(1, { description: 'piso 1' }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteClassroom', () => {
    it('should delete a classroom', async () => {
      jest
        .spyOn(classroomRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.deleteClassroom(1);
      expect(result).toEqual({ message: 'Aula eliminada' });
      expect(classroomRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an exception when classroom is not found', async () => {
      jest
        .spyOn(classroomRepository, 'delete')
        .mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.deleteClassroom(1)).rejects.toThrow(HttpException);
    });
  });
});
