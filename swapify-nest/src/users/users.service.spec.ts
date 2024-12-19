import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UtilsService } from '../utils/utils.service';

const usersArray = [
  {
    id_user: 1,
    name: 'Federico',
    surname: 'Gonzalez',
    password: '123456',
    email: 'federico@gmail.com',
    role: 0,
  },
  {
    id_user: 2,
    name: 'Gonzalo',
    surname: 'Martinez',
    password: '123456',
    email: 'gonzalo@gmail.com',
    role: 1,
  },

  {
    id_user: 3,
    name: 'Gustavo',
    surname: 'Messi',
    password: '123456',
    email: 'gustavo@gmail.com',
    role: 1,
  },
];

const oneUser = {
  id_user: 1,
  name: 'Federico',
  surname: 'Gonzalez',
  password: '123456',
  email: 'federico@gmail.com',
  role: 0,
};

const getOneUser = {
  id_user: 1,
  name: 'Federico',
  surname: 'Gonzalez',
  password: '$2a$10$KqzrUgLlKotrrHiZHgPrZenAwlJlJRdYSm5HH1ge3ZqQFmUJyme/m',
  email: 'federico@gmail.com',
  role: 0,
};
const mergeUser = {
  id_user: 1,
  name: 'Manuel',
  surname: 'Fernandez',
  password: '123456',
  email: 'federico@gmail.com',
  role: 1,
};

describe('UsersService', () => {
  let userService: UsersService;
  const MockUsersRepository = {
    find: jest.fn(() => usersArray),
    findOneBy: jest.fn(() => oneUser),
    create: jest.fn(() => oneUser),
    findOne: jest.fn(() => getOneUser),
    delete: jest.fn(),
    save: jest.fn(() => mergeUser),
    merge: jest.fn(() => mergeUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UtilsService,
        {
          provide: getRepositoryToken(User),
          useValue: MockUsersRepository,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser = {
        name: 'Federico',
        surname: 'Gonzalez',
        password: '123456',
        email: 'federico@gmail.com',
        role: 0,
      };
      await userService.createUser(mockUser);
      expect(MockUsersRepository.create).toHaveBeenCalledWith(mockUser);
    });
  });
  describe('getAllUser', () => {
    it('should return an array of users when xml is not provided', async () => {
      const result = await userService.getAllUser();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getAllUser', () => {
    it('should return an XML string when xml is set to "true"', async () => {
      const result = await userService.getAllUser('true');
      expect(typeof result).toBe('string');
    });
  });

  describe('getUser', () => {
    it('should return an users when xml is not provided', async () => {
      const result = await userService.getUser(1);
      expect(typeof result).toBe('object');
    });
  });
  describe('getUser', () => {
    it('should return an XML string when xml is set to "true"', async () => {
      const result = await userService.getUser(1, 'true');
      expect(typeof result).toBe('string');
    });
  });
  describe('updateUser', () => {
    it('should update a user', async () => {
      const mockUser = {
        id_user: 1,
        name: 'Manuel',
        surname: 'Fernandez',
        password: '123456',
        email: 'federico@gmail.com',
        role: 1,
      };
      const result = await userService.updateUser(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      userService.deleteUser(1);
      expect(MockUsersRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
