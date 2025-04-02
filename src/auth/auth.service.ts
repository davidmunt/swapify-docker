import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  //funcion que autentifica al usuario y devuelve un token JWT
  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
      select: ['id_user', 'email', 'password'], 
    });
    if (!user) {
      throw new HttpException('Credenciales invalidas', HttpStatus.UNAUTHORIZED);
    }
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Credenciales invalidas', HttpStatus.UNAUTHORIZED);
    }
    const payload = { sub: user.id_user, email: user.email };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
