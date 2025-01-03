import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ProductCategory } from "../../../product_cathegories/product_category.entity";
import productCategoryData from '../../../data/product_category';

export class ProductCategorySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const productCategoryRepository = dataSource.getRepository(ProductCategory);
    await productCategoryRepository.save(productCategoryData);
    console.log('Datos de Product category insertados correctamente');
  }
}
