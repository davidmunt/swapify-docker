import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UtilsModule } from '../utils/utils.module';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/Autentication/auth.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([User]), MailModule],
  exports: [TypeOrmModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
