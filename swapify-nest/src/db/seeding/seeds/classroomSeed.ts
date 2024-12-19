import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Classroom } from '../../../classroom/classroom.entity';
import classroomData from '../../../data/classroom';

export class ClassroomSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const classroomRepository = dataSource.getRepository(Classroom);

    await classroomRepository.save(classroomData);

    console.log('Classroom seeding completed!');
  }
}
