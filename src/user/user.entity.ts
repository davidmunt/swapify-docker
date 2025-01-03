import { UploadEntity } from '../upload/upload.entity';
import { Product } from '../product/product.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id_user: string; 

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  @Column('bigint')
  telNumber: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Column({ nullable: true })
  avatar_id: number | null;

  @Column()
  dateBirth: Date; 

  @OneToMany(() => UploadEntity, (upload) => upload.user)
  upload: UploadEntity[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}