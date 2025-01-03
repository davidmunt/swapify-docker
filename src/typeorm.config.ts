import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { ProductCategory } from './product_cathegories/product_category.entity';
import { Product } from './product/product.entity';
import { User } from './user/user.entity';
import { UploadEntity } from './upload/upload.entity';
import { ProductState } from './product_state/product_state.entity';
import { ProductSaleState } from './product_sale_state/product_sale_state.entity';

dotenv.config();

const config = {
  type: 'mysql',
  host: 'database',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [
    ProductState,
    ProductSaleState,
    User,
    UploadEntity,
    Product,
    ProductCategory,
  ],
  migrations: ['./src/migrations/*.ts'],
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
