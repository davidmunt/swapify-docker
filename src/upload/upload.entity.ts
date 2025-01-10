import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Entity('upload')
export class UploadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'link' })
  path: string;

  @Column()
  name: string;

  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_product' })
  product: Product;

  @ManyToOne(
    () => User,
    (user) => user.upload,
    {
      onDelete: 'CASCADE', 
    },
  )
  @JoinColumn({ name: 'id_user' })
  user: User;
}
