import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { config } from 'dotenv';
import { ProductCategory } from './product_cathegories/product_category.entity';
import { ProductCategorySeeder } from './db/seeding/seeds/product_category.seeds';
import { Product } from './product/product.entity';
import { User } from './user/user.entity';
import { UploadEntity } from './upload/upload.entity';
import { ProductStateSeeder } from './db/seeding/seeds/product_state.seeds';
import { ProductSaleStateSeeder } from './db/seeding/seeds/product_sale_state.seeds';
import { ProductState } from './product_state/product_state.entity';
import { ProductLike } from './product_like/product_like.entity';
import { ProductSaleState } from './product_sale_state/product_sale_state.entity';
import { ProductView } from './product_view/product_view.entity'; 

config();

const options: DataSourceOptions & SeederOptions = {
  type: 'mariadb',
  host: 'database',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,

  entities: [
    ProductState,
    ProductSaleState,
    ProductCategory,
    Product,
    User,
    UploadEntity,
    ProductLike,
    ProductView,
  ],
  seeds: [
    ProductCategorySeeder,
    ProductStateSeeder,
    ProductSaleStateSeeder,
  ],
};

const dataSource = new DataSource(options);

dataSource
  .initialize()
  .then(async () => {
    await dataSource.synchronize(true);
    await runSeeders(dataSource);
    process.exit();
  })
  .catch((error) => console.log('Error initializing data source', error));
