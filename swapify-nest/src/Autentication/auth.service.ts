import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async generateToken(id_user: number): Promise<string> {
    const token = uuidv4();
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    await this.userRepository.update(id_user, {
      token,
      tokenExpiration: expirationDate,
    });

    return token;
  }

  async validateToken(token: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { token } });
    if (!user) return false;

    const now = new Date();
    if (user.tokenExpiration < now) {
      await this.userRepository.update(user.id_user, {
        token: null,
        tokenExpiration: null,
      });
      return false;
    }

    return true;
  }

  async clearToken(id_user: number): Promise<void> {
    await this.userRepository.update(id_user, {
      token: null,
      tokenExpiration: null,
    });
  }
}
