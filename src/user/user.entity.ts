import { UploadEntity } from '../upload/upload.entity';
import { Product } from '../product/product.entity';
import { ProductLike } from '../product_like/product_like.entity';
import { ProductView } from '../product_view/product_view.entity';
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

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) 
  rating: number;

  @Column({ default: 0 }) 
  num_rating: number;

  @Column({ nullable: true }) 
  avatar_id: number | null;

  @Column()
  dateBirth: Date; 

  @Column({ nullable: true }) 
  tokenNotifications?: string;

  @OneToMany(() => UploadEntity, (upload) => upload.user, { onDelete: 'CASCADE' })
  upload: UploadEntity[];

  @OneToMany(() => Product, (product) => product.user, { onDelete: 'CASCADE' })
  products: Product[];

  @OneToMany(() => Product, (product) => product.buyer, { onDelete: 'CASCADE' })
  buyerProducts: Product[];

  @OneToMany(() => ProductLike, (like) => like.user, { onDelete: 'CASCADE' })
  likes: ProductLike[];

  @OneToMany(() => ProductView, (productView) => productView.user, { onDelete: 'CASCADE' })
  productViews: ProductView[];
}
