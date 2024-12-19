import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import issueData from '../../../data/inventory_issues';
import { Issue } from '../../../issues/issues.entity';
import { Inventari } from '../../../inventari/inventari.entity';
import { Status } from '../../../status/status.entity';
import { User } from '../../../users/users.entity';

export class IssueSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const issueRepository = dataSource.getRepository(Issue);
    const inventariRepository = dataSource.getRepository(Inventari);
    const statusRepository = dataSource.getRepository(Status);
    const userRepository = dataSource.getRepository(User);
    const issueEntries = await Promise.all(
      issueData.map(async (item) => {
        const issueEntry = new Issue();
        issueEntry.fk_inventari = await inventariRepository.findOneBy({
          id_inventory: item.id_inventory,
        });
        issueEntry.status = await statusRepository.findOneBy({
          id_status: item.id_status,
        });
        issueEntry.user = await userRepository.findOneBy({
          id_user: item.id_user,
        });
        issueEntry.technician = await userRepository.findOneBy({
          id_user: item.id_tecnic,
        });
        issueEntry.description = item.description;
        issueEntry.notes = item.notes;
        return issueEntry;
      }),
    );
    await issueRepository.save(issueEntries);
    console.log('Issue seeding completed!');
  }
}
