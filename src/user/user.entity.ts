import { UploadEntity } from '../upload/upload.entity';
import { Product } from '../product/product.entity';
import { ProductLike } from '../product_like/product_like.entity';
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

  @Column('bigint') 
  telNumber: number;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) 
  balance: number;

  @Column({ nullable: true }) 
  avatar_id: number | null;

  @Column()
  dateBirth: Date; 

  @OneToMany(() => UploadEntity, (upload) => upload.user)
  upload: UploadEntity[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => ProductLike, (like) => like.user)
  likes: ProductLike[];
}
