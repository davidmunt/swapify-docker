import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ProductSaleState } from "../../../product_sale_state/product_sale_state.entity";
import productSaleStateData from '../../../data/product_sale_state';

export class ProductSaleStateSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const productSaleStateRepository = dataSource.getRepository(ProductSaleState);
    await productSaleStateRepository.save(productSaleStateData);
    console.log('Datos de Product sale state insertados correctamente');
  }
}
