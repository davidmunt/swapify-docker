import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import uploadData from '../../../data/upload';
import { UploadEntity } from '../../../upload/upload.entity';

export class UploadSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const uploadRepository = dataSource.getRepository(UploadEntity);

    await uploadRepository.save(uploadData);

    console.log('Upload seeding completed!');
  }
}
