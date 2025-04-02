import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Product } from '../product/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, AddBallanceToUserDto, ChangePasswordDto, AddRatingToUserDto } from './user.dto';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: function(password: string, salt: number) {
    return Promise.resolve('hashed_' + password);
  }
}));

const sampleUser: User = {
  id_user: 'user1',
  password: 'hashed_password',
  name: 'David',
  surname: 'Muntean',
  telNumber: 1334567889,
  email: 'david@gmail.com',
  balance: 100,
  rating: 4.5,
  num_rating: 2,
  avatar_id: null,
  dateBirth: new Date('2000-05-15'),
  tokenNotifications: null,
  upload: [],
  products: [],
  buyerProducts: [],
  likes: [],
  productViews: []
};

const sampleUserForRating: User = Object.assign({}, sampleUser);

const completeCustomer: User = {
  id_user: 'customer1',
  password: 'hashed_pass',
  name: 'Cliente',
  surname: 'Test',
  telNumber: 1234567890,
  email: 'cliente@test.com',
  balance: 200,
  rating: 4,
  num_rating: 1,
  avatar_id: null,
  dateBirth: new Date('1990-01-01'),
  tokenNotifications: null,
  upload: [],
  products: [],
  buyerProducts: [],
  likes: [],
  productViews: []
};

const sampleCreateUserDto: CreateUserDto = {
  id_user: 'user1',
  password: 'contraseña',
  name: 'David',
  surname: 'Muntean',
  telNumber: 1334567889,
  email: 'david@gmail.com',
  dateBirth: '2000-05-15'
};

const sampleUpdateUserDto: UpdateUserDto = {
  name: 'DavidActualizado'
};

const sampleAddBallanceDto: AddBallanceToUserDto = {
  id_user: 'user1',
  balance: 50
};

const sampleChangePasswordDto: ChangePasswordDto = {
  id_user: 'user1',
  newPassword: 'nuevaContraseña456'
};

const sampleAddRatingDto: AddRatingToUserDto = {
  id_user: 'user1',
  id_customer: 'customer1',
  id_product: 10,
  rating: 4.5
};

const sampleProduct: Product = Object.assign({}, {
  id_product: 10,
  product_model: 'TestModel',
  product_brand: 'TestBrand',
  price: 100,
  description: 'Test product',
  latitude_created: 0,
  longitude_created: 0,
  name_city_created: 'TestCity',
  created_at: new Date(),
  last_updated: new Date(),
  exchangedWith: null,
  product_category: null,
  product_state: null,
  product_sale_state: null,
  user: sampleUserForRating,
  buyer: {
    id_user: completeCustomer.id_user,
    password: completeCustomer.password,
    name: completeCustomer.name,
    surname: completeCustomer.surname,
    telNumber: completeCustomer.telNumber,
    email: completeCustomer.email,
    balance: completeCustomer.balance,
    rating: completeCustomer.rating,
    num_rating: completeCustomer.num_rating,
    avatar_id: completeCustomer.avatar_id,
    dateBirth: completeCustomer.dateBirth,
    tokenNotifications: completeCustomer.tokenNotifications,
    upload: [],
    products: [],
    buyerProducts: [],
    likes: [],
    productViews: []
  },
  images: [],
  likes: [],
  productViews: []
});

describe('UserService', () => {
  let userService: UserService;

  const MockUsersRepository = {
    find: jest.fn(() => Promise.resolve([sampleUser])),
    findOne: jest.fn((criteria: any) => {
      if (criteria.where.id_user === 'user1') return Promise.resolve(sampleUser);
      if (criteria.where.email === 'david@gmail.com') return Promise.resolve(sampleUser);
      if (criteria.where.id_user === 'customer1') return Promise.resolve(completeCustomer);
      return Promise.resolve(null);
    }),
    create: jest.fn((dto: any) => dto),
    save: jest.fn((data: any) => Promise.resolve(data)),
    merge: jest.fn((existing: any, update: any) => Object.assign(existing, update)),
    delete: jest.fn(() => Promise.resolve({ affected: 1 }))
  };

  const MockProductRepository = {
    findOne: jest.fn((criteria: any) => {
      if (criteria.where.id_product === sampleAddRatingDto.id_product) {
        return Promise.resolve(sampleProduct);
      }
      return Promise.resolve(null);
    })
  };

  let userServiceModule: TestingModule;

  beforeEach(async () => {
    jest.clearAllMocks();
    userServiceModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: MockUsersRepository },
        { provide: getRepositoryToken(Product), useValue: MockProductRepository }
      ]
    }).compile();
    userService = userServiceModule.get<UserService>(UserService);
  });

  describe('getAllUsers', () => {
    it('devuelve todos los usuarios', async () => {
      const result = await userService.getAllUsers();
      expect(result).toEqual([sampleUser]);
      expect(MockUsersRepository.find).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('devuelve un usuario por id', async () => {
      const result = await userService.getUser('user1');
      expect(result).toEqual(sampleUser);
      expect(MockUsersRepository.findOne).toHaveBeenCalledWith({ where: { id_user: 'user1' } });
    });
    it('lanza error si el usuario no existe', async () => {
      MockUsersRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(userService.getUser('nonexistent')).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('createUser', () => {
    it('crea un nuevo usuario', async () => {
      MockUsersRepository.findOne.mockImplementation(() => Promise.resolve(null));
      const result = await userService.createUser(sampleCreateUserDto);
      expect(MockUsersRepository.create(sampleCreateUserDto)).toEqual(sampleCreateUserDto);
      expect(result.password).toEqual('hashed_contraseña');
    });
    it('lanza error si el id del usuario ya esta en uso', async () => {
      MockUsersRepository.findOne.mockImplementation(() => Promise.resolve(sampleUser));
      await expect(userService.createUser(sampleCreateUserDto)).rejects.toThrow('ID del usuario en uso');
    });
    it('lanza error si el email del usuario ya esta en uso', async () => {
      let callCount = 0;
      MockUsersRepository.findOne.mockImplementation((criteria: any) => {
        callCount++;
        if (callCount === 1) return Promise.resolve(null);
        if (callCount === 2) return Promise.resolve(sampleUser);
        return Promise.resolve(null);
      });
      await expect(userService.createUser(sampleCreateUserDto)).rejects.toThrow('Email del usuario en uso');
    });
    it('lanza error si el nombre esta vacio', async () => {
      var dto = Object.assign({}, sampleCreateUserDto);
      dto.name = ' ';
      await expect(userService.createUser(dto)).rejects.toThrow('El nombre no puede estar vacio');
    });
    it('lanza error si el apellido esta vacio', async () => {
      var dto = Object.assign({}, sampleCreateUserDto);
      dto.surname = ' ';
      await expect(userService.createUser(dto)).rejects.toThrow('El apellido no puede estar vacio');
    });
    it('lanza error si el email esta vacio', async () => {
      var dto = Object.assign({}, sampleCreateUserDto);
      dto.email = ' ';
      await expect(userService.createUser(dto)).rejects.toThrow('El email no puede estar vacio');
    });
    it('lanza error si la fecha de nacimiento no es valida', async () => {
      var dto = Object.assign({}, sampleCreateUserDto);
      dto.dateBirth = 'invalid-date';
      await expect(userService.createUser(dto)).rejects.toThrow('La fecha de nacimiento no es valida');
    });
  });

  describe('updateUser', () => {
    it('actualiza un usuario existente', async () => {
        MockUsersRepository.findOne.mockImplementation(() => Promise.resolve(sampleUser)); 
        const result = await userService.updateUser('user1', sampleUpdateUserDto);
        expect(MockUsersRepository.merge(sampleUser, sampleUpdateUserDto)).toEqual(Object.assign(sampleUser, sampleUpdateUserDto));
        expect(result.name).toEqual(sampleUpdateUserDto.name);
      });      
    it('lanza error si el usuario no existe', async () => {
      MockUsersRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(userService.updateUser('nonexistent', sampleUpdateUserDto)).rejects.toThrow('Usario no encontrado');
    });
  });

  describe('deleteUser', () => {
    it('elimina un usuario', async () => {
      MockUsersRepository.findOne.mockImplementation(() => Promise.resolve(sampleUser));
      await userService.deleteUser('user1');
      expect(MockUsersRepository.delete).toHaveBeenCalledWith({ id_user: 'user1' });
    });
    it('lanza error si el usuario no existe', async () => {
      MockUsersRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(userService.deleteUser('nonexistent')).rejects.toThrow('Usario no encontrado');
    });
  });

  describe('addBallanceToUser', () => {
    it('añade saldo al usuario correctamente', async () => {
      var updatedUser = Object.assign({}, sampleUser);
      updatedUser.balance = sampleUser.balance + 50;
      MockUsersRepository.findOne.mockImplementation(() => Promise.resolve(sampleUser));
      const result = await userService.addBallanceToUser(sampleAddBallanceDto);
      expect(result.balance).toEqual(updatedUser.balance);
    });
    it('lanza error si el usuario no existe', async () => {
      MockUsersRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(userService.addBallanceToUser(sampleAddBallanceDto)).rejects.toThrow('Usuario no encontrado');
    });
    it('lanza error si el saldo a añadir es negativo o cero', async () => {
      var dto = Object.assign({}, sampleAddBallanceDto);
      dto.balance = 0;
      await expect(userService.addBallanceToUser(dto)).rejects.toThrow('El saldo a añadir no puede ser 0 o un numero negativo');
    });
  });

  describe('changePassword', () => {
    it('cambia la contraseña correctamente', async () => {
      MockUsersRepository.findOne.mockImplementation(() => Promise.resolve(sampleUser));
      const result = await userService.changePassword(sampleChangePasswordDto);
      expect(result).toEqual('Contraseña actualizada correctamente');
    });
    it('lanza error si el usuario no existe', async () => {
      MockUsersRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(userService.changePassword(sampleChangePasswordDto)).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('addRatingToUser', () => {
    it('añade una valoracion correctamente', async () => {
      var completeUserForRating = Object.assign({}, sampleUserForRating);
      completeUserForRating.rating = 4.5;
      completeUserForRating.num_rating = 2;
      var productForRating = Object.assign({}, sampleProduct, {
        user: completeUserForRating,
        buyer: {
          id_user: completeCustomer.id_user,
          password: completeCustomer.password,
          name: completeCustomer.name,
          surname: completeCustomer.surname,
          telNumber: completeCustomer.telNumber,
          email: completeCustomer.email,
          balance: completeCustomer.balance,
          rating: completeCustomer.rating,
          num_rating: completeCustomer.num_rating,
          avatar_id: completeCustomer.avatar_id,
          dateBirth: completeCustomer.dateBirth,
          tokenNotifications: completeCustomer.tokenNotifications,
          upload: [],
          products: [],
          buyerProducts: [],
          likes: [],
          productViews: []
        }
      });
      MockUsersRepository.findOne.mockImplementation((criteria: any) => {
        if (criteria.where.id_user === 'user1') return Promise.resolve(completeUserForRating);
        if (criteria.where.id_user === 'customer1') return Promise.resolve(completeCustomer);
        return Promise.resolve(null);
      });      
      MockProductRepository.findOne.mockImplementation((criteria: any) => {
        if (criteria.where.id_product === sampleAddRatingDto.id_product) return Promise.resolve(productForRating);
        return Promise.resolve(null);
      });      
      const result = await userService.addRatingToUser(sampleAddRatingDto);
      var expectedRating = parseFloat((((completeUserForRating.rating * completeUserForRating.num_rating) + sampleAddRatingDto.rating) / (completeUserForRating.num_rating + 1)).toFixed(2));
      expect(result.rating).toEqual(expectedRating);
    });
    it('lanza error si el usuario no existe', async () => {
        MockUsersRepository.findOne.mockImplementation(() => Promise.resolve(null));
      await expect(userService.addRatingToUser(sampleAddRatingDto)).rejects.toThrow('Usuario no encontrado');
    });
    it('lanza error si el cliente no existe', async () => {
        MockUsersRepository.findOne.mockImplementation((criteria: any) => {
            if (criteria.where.id_user === 'user1') return Promise.resolve(sampleUser);
            if (criteria.where.id_user === 'customer1') return Promise.resolve(null);
            return Promise.resolve(null);
          });          
      await expect(userService.addRatingToUser(sampleAddRatingDto)).rejects.toThrow('Cliente no encontrado');
    });
    it('lanza error si el producto no existe', async () => {
        MockUsersRepository.findOne.mockImplementation((criteria: any) => {
            if (criteria.where.id_user === 'user1') return Promise.resolve(sampleUser);
            if (criteria.where.id_user === 'customer1') return Promise.resolve(completeCustomer);
            return Promise.resolve(null);
          });          
      MockProductRepository.findOne.mockImplementation(() => Promise.resolve(null));
      await expect(userService.addRatingToUser(sampleAddRatingDto)).rejects.toThrow('Usuario no encontrado');
    });
    it('lanza error si el usuario no es el dueño del producto', async () => {
      var anotherUser = {
        id_user: 'anotherUser',
        password: 'hashed_pass',
        name: 'Otro',
        surname: 'User',
        telNumber: 1111111111,
        email: 'otro@test.com',
        balance: 50,
        rating: 3,
        num_rating: 1,
        avatar_id: null,
        dateBirth: new Date('1995-01-01'),
        tokenNotifications: null,
        upload: [],
        products: [],
        buyerProducts: [],
        likes: [],
        productViews: []
      };
      var productForRating = Object.assign({}, sampleProduct, {
        user: anotherUser,
        buyer: {
          id_user: completeCustomer.id_user,
          password: completeCustomer.password,
          name: completeCustomer.name,
          surname: completeCustomer.surname,
          telNumber: completeCustomer.telNumber,
          email: completeCustomer.email,
          balance: completeCustomer.balance,
          rating: completeCustomer.rating,
          num_rating: completeCustomer.num_rating,
          avatar_id: completeCustomer.avatar_id,
          dateBirth: completeCustomer.dateBirth,
          tokenNotifications: completeCustomer.tokenNotifications,
          upload: [],
          products: [],
          buyerProducts: [],
          likes: [],
          productViews: []
        }
      });
      MockUsersRepository.findOne.mockImplementation((criteria: any) => {
        if (criteria.where.id_user === 'user1') return Promise.resolve(sampleUser);
        if (criteria.where.id_user === 'customer1') return Promise.resolve(completeCustomer);
        return Promise.resolve(null);
      });      
      MockProductRepository.findOne.mockImplementation((criteria: any) => {
        return Promise.resolve(productForRating);
      });      
      await expect(userService.addRatingToUser(sampleAddRatingDto)).rejects.toThrow('El usuario no es el dueño del producto');
    });
    it('lanza error si el producto no ha sido comprado', async () => {
      var productForRating = Object.assign({}, sampleProduct, {
        user: sampleUserForRating,
        buyer: {
          id_user: null,
          password: '',
          name: '',
          surname: '',
          telNumber: 0,
          email: '',
          balance: 0,
          rating: 0,
          num_rating: 0,
          avatar_id: null,
          dateBirth: new Date(),
          tokenNotifications: null,
          upload: [],
          products: [],
          buyerProducts: [],
          likes: [],
          productViews: []
        }
      });
      MockUsersRepository.findOne.mockImplementation((criteria: any) => {
        if (criteria.where.id_user === 'user1') return Promise.resolve(sampleUserForRating);
        if (criteria.where.id_user === 'customer1') return Promise.resolve(completeCustomer);
        return Promise.resolve(null);
      });      
      MockProductRepository.findOne.mockImplementation((criteria: any) => {
        return Promise.resolve(productForRating);
      });      
      await expect(userService.addRatingToUser(sampleAddRatingDto)).rejects.toThrow('El producto no ha sido comprado');
    });
    it('lanza error si el comprador del producto no coincide con el cliente', async () => {
      var productForRating = Object.assign({}, sampleProduct, {
        user: sampleUserForRating,
        buyer: {
          id_user: 'differentCustomer',
          password: 'hashed_pass',
          name: 'Cliente',
          surname: 'Test',
          telNumber: 1234567890,
          email: 'cliente@test.com',
          balance: 500,
          rating: 4,
          num_rating: 1,
          avatar_id: null,
          dateBirth: new Date('1990-01-01'),
          tokenNotifications: null,
          upload: [],
          products: [],
          buyerProducts: [],
          likes: [],
          productViews: []
        }
      });
      MockUsersRepository.findOne.mockImplementation((criteria: any) => {
        if (criteria.where.id_user === 'user1') return Promise.resolve(sampleUserForRating);
        if (criteria.where.id_user === 'customer1') return Promise.resolve(completeCustomer);
        return Promise.resolve(null);
      });      
      MockProductRepository.findOne.mockImplementation((criteria: any) => {
        return Promise.resolve(productForRating);
      });      
      await expect(userService.addRatingToUser(sampleAddRatingDto)).rejects.toThrow('El usuario no es el comprador del producto');
    });

    it('lanza error si la valoracion no es valida', async () => {
        const dto = Object.assign({}, sampleAddRatingDto);
        dto.rating = 6; 
        MockUsersRepository.findOne.mockImplementation((criteria: any) => {
          if (criteria.where.id_user === 'user1') return Promise.resolve(sampleUserForRating);
          if (criteria.where.id_user === 'customer1') return Promise.resolve(completeCustomer);
          return Promise.resolve(null);
        });
        const productWithMatchingBuyer = Object.assign({}, sampleProduct, {
          user: sampleUserForRating,
          buyer: completeCustomer 
        });
        MockProductRepository.findOne.mockImplementation(() => Promise.resolve(productWithMatchingBuyer));
        await expect(userService.addRatingToUser(dto)).rejects.toThrow('La valoracion a añadir tiene que ser mas de 0 y menos de 5');
      });          
  });

  describe('vincularArchivo', () => {
    it('actualiza el avatar_id correctamente', async () => {
      var updatedUser = Object.assign({}, sampleUser);
      updatedUser.avatar_id = 123;
      MockUsersRepository.findOne.mockImplementation((criteria: any) => {
        return Promise.resolve(sampleUser);
      });      
      const result = await userService.vincularArchivo('user1', 123);
      expect(result.avatar_id).toEqual(123);
    });
    it('lanza error si el usuario no existe', async () => {
        MockUsersRepository.findOne.mockImplementation(() => Promise.resolve(null));
      await expect(userService.vincularArchivo('nonexistent', 123)).rejects.toThrow('Usuario no encontrado');
    });
  });
});
