import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UploadEntity } from './upload.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([UploadEntity, User, Product]),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
