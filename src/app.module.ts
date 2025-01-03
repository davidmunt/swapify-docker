import {
  Module,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service'; 
import { UtilsModule } from './utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product_cathegories/product_category.module';
import { ProductStateModule } from './product_state/product_state.module';
import { ProductSaleStateModule } from './product_sale_state/product_sale_state.module';
import { ProductCategory } from './product_cathegories/product_category.entity';
import { ProductState } from './product_state/product_state.entity';
import { ProductSaleState } from './product_sale_state/product_sale_state.entity';
import { UploadEntity } from './upload/upload.entity';
import { Product } from './product/product.entity';
import { User } from './user/user.entity';
import { ProductController } from './product/product.controller';
import { ProductCategoryController } from './product_cathegories/product_category.controller';
import { ProductStateController } from './product_state/product_state.controller';
import { ProductSaleStateController } from './product_sale_state/product_sale_state.controller';
import { ProductService } from './product/product.service';
import { ProductCategoryService } from './product_cathegories/product_category.service';
import { ProductStateService } from './product_state/product_state.service';
import { ProductSaleStateService } from './product_sale_state/product_sale_state.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ProductStateModule,
    ProductSaleStateModule,
    UserModule,
    ProductModule,
    ProductCategoryModule,
    UtilsModule,
    UploadModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'database',
        port: +configService.get('MYSQL_PORT') || 3306,
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [
          ProductState,
          ProductSaleState,
          User,
          Product,
          ProductCategory,
          UploadEntity,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController, ProductCategoryController, ProductStateController, ProductSaleStateController, ProductController],
  providers: [UserService, ProductCategoryService, ProductStateService, ProductSaleStateService, ProductService],
})
export class AppModule {
}
