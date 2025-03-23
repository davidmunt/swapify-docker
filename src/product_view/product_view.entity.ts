import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Entity('product_view')
export class ProductView {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id_user, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, (product) => product.id_product, { onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn()
  viewed_at: Date;
}
