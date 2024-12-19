import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Inventari_type } from '../../../inventari_type/inventari_type.entity';
import inventariTypeData from '../../../data/inventory_type';

export class Inventary_typeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const inventariTypeRepository = dataSource.getRepository(Inventari_type);

    await inventariTypeRepository.save(inventariTypeData);

    console.log(
      'Datos de Inventari_type insertados desde inventari_type.data.ts',
    );
  }
}
