import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(    
    @InjectRepository(User) private readonly usersRepository: Repository<User>
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

  async vincularArchivo(id_user: string, id_archivo: number) {
    const user = await this.usersRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    user.avatar_id = id_archivo;
    return this.usersRepository.save(user);
  }   
}
