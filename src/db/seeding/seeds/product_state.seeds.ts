import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ProductState } from "../../../product_state/product_state.entity";
import productStateData from '../../../data/product_state';

export class ProductStateSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const productStateRepository = dataSource.getRepository(ProductState);
    await productStateRepository.save(productStateData);
    console.log('Datos de Product state insertados correctamente');
  }
}
