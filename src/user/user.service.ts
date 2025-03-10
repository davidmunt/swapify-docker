import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddBallanceToUserDto, AddRatingToUserDto, CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class UserService {
  constructor(    
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUser(id_user: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userIdUsed = await this.usersRepository.findOne({
      where: [{ id_user: createUserDto.id_user }],
    });
    const userEmailUsed = await this.usersRepository.findOne({
      where: [{ email: createUserDto.email }],
    });
      if (userIdUsed) {
        throw new HttpException('ID del usuario en uso', HttpStatus.CONFLICT);
      }
      if (userEmailUsed) {
        throw new HttpException('Email del usuario en uso', HttpStatus.CONFLICT);
      }  
      if (createUserDto.name.trim() === '') {
        throw new HttpException('El nombre no puede estar vacio', HttpStatus.BAD_REQUEST);
      }
      
      if (createUserDto.surname.trim() === '') {
        throw new HttpException('El apellido no puede estar vacio', HttpStatus.BAD_REQUEST);
      }
      
      if (createUserDto.email.trim() === '') {
        throw new HttpException('El email no puede estar vacio', HttpStatus.BAD_REQUEST);
      }
      
      if (isNaN(Date.parse(createUserDto.dateBirth))) {
        throw new HttpException('La fecha de nacimiento no es valida', HttpStatus.BAD_REQUEST);
      }
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }  

  async updateUser(id_user: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new HttpException('Usario no encontrado', HttpStatus.NOT_FOUND);
    }
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async deleteUser(id_user: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new HttpException('Usario no encontrado', HttpStatus.NOT_FOUND);
    }
    await this.usersRepository.delete({ id_user });
  }

  async addBallanceToUser(addBallanceToUserDto: AddBallanceToUserDto): Promise<User> {
    const id_user = addBallanceToUserDto.id_user;
    const balance = parseFloat(addBallanceToUserDto.balance.toString()); 
    const user = await this.usersRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    if (balance <= 0) {
      throw new HttpException('El saldo a añadir no puede ser 0 o un numero negativo', HttpStatus.BAD_REQUEST);
    }
    user.balance = parseFloat(user.balance.toString()) + balance;
    user.balance = parseFloat(user.balance.toFixed(2)); 
    return await this.usersRepository.save(user);
  }

  async addRatingToUser(addRatingToUserDto: AddRatingToUserDto): Promise<User> {
    const id_user = addRatingToUserDto.id_user;
    const id_customer = addRatingToUserDto.id_customer;
    const id_product = addRatingToUserDto.id_product;
    const rating = addRatingToUserDto.rating;
    const parsedRating = parseFloat(rating.toString());
    const user = await this.usersRepository.findOne({ where: { id_user: id_user } });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    const customer = await this.usersRepository.findOne({ where: { id_user: id_customer } });
    if (!customer) {
      throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
    }
    const product = await this.productRepository.findOne({ 
      where: { id_product: id_product }, 
      relations: ['user', 'buyer'] 
    });
    if (!product) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    if (product.user.id_user != id_user) {
      throw new HttpException('El usuario no es el dueño del producto', HttpStatus.BAD_REQUEST);
    }
    if (product.buyer.id_user == null) {
      throw new HttpException('El producto no ha sido comprado', HttpStatus.BAD_REQUEST);
    }
    if (product.buyer.id_user != id_customer) {
      throw new HttpException('El usuario no es el comprador del producto', HttpStatus.BAD_REQUEST);
    }
    if (parsedRating <= 0 || parsedRating > 5) {
      throw new HttpException('La valoracion a añadir tiene que ser mas de 0 y menos de 5', HttpStatus.BAD_REQUEST);
    }
    user.rating = (user.rating * user.num_rating + parsedRating) / (user.num_rating + 1);
    user.num_rating += 1;
    user.rating = parseFloat(user.rating.toFixed(2));
    return await this.usersRepository.save(user);
  }

  async vincularArchivo(id_user: string, id_archivo: number) {
    const user = await this.usersRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    user.avatar_id = id_archivo;
    return this.usersRepository.save(user);
  }   
}
