import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Status } from '../../../status/status.entity';
import statusData from '../../../data/inventory_status';

export class StatusSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const statusRepository = dataSource.getRepository(Status);

    await statusRepository.save(statusData);

    console.log('Status seeding completed!');
  }
}
