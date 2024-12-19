import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Inventari } from '../../../inventari/inventari.entity';
import { Inventari_type } from '../../../inventari_type/inventari_type.entity';
import { Classroom } from '../../../classroom/classroom.entity';
import inventoryData from '../../../data/inventory';

export class InventariSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const inventariRepository = dataSource.getRepository(Inventari);
    const inventariTypeRepository = dataSource.getRepository(Inventari_type);
    const classroomRepository = dataSource.getRepository(Classroom);

    const inventarisToSave = await Promise.all(
      inventoryData.map(async (item) => {
        const inventariType = await inventariTypeRepository.findOne({
          where: { id_type: item.id_type },
        });
        const classroom = await classroomRepository.findOne({
          where: { id_classroom: item.id_classroom },
        });

        if (!inventariType || !classroom) {
          throw new Error(
            `No se pudo encontrar tipo de inventario o aula para el ítem: ${JSON.stringify(item)}`,
          );
        }

        return {
          num_serie: item.num_serie,
          brand: item.brand,
          model: item.model,
          GVA_cod_article: item.GVA_cod_article,
          GVA_description_cod_articulo: item.GVA_description_cod_articulo,
          status: item.status,
          fk_inventary_type: inventariType,
          fk_classroom: classroom,
          text_etiqueta:
            inventariType.description +
            ' ' +
            item.model +
            '(' +
            item.brand +
            ')',
          id_device_info: '0',
        };
      }),
    );
    await inventariRepository.save(inventarisToSave);

    console.log('Inventari seeding completed!');
  }
}
