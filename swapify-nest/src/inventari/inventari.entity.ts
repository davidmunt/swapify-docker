import { Inventari_type } from '../inventari_type/inventari_type.entity';
import { Issue } from '../issues/issues.entity';
import { Classroom } from '../classroom/classroom.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Inventari {
  @PrimaryGeneratedColumn()
  id_inventory: number;

  @Column()
  num_serie: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  GVA_cod_article: number;

  @Column()
  GVA_description_cod_articulo: string;

  @Column()
  status: string;

  @Column()
  text_etiqueta: string;

  @Column()
  id_device_info: string;

  @ManyToOne(
    () => Inventari_type,
    (inventariType) => inventariType.fk_inventari,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'id_type' })
  fk_inventary_type: Inventari_type;

  @ManyToOne(() => Classroom, (classroom) => classroom.fk_inventari, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_classroom' })
  fk_classroom: Classroom;

  @OneToMany(() => Issue, (issue) => issue.fk_inventari)
  fk_issue: Issue[];
}
