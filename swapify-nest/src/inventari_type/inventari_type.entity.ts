import { Inventari } from '../inventari/inventari.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Inventari_type {
  @PrimaryGeneratedColumn()
  id_type: number;

  @Column()
  description: string;

  @OneToMany(() => Inventari, (fk_inventari) => fk_inventari.fk_inventary_type)
  fk_inventari: Inventari[];
}
