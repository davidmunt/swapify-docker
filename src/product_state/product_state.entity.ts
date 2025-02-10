import { Product } from '../product/product.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';
  
@Entity()
export class ProductState {
  @PrimaryGeneratedColumn()
  id_state_product: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Product, (product) => product.product_state, { onDelete: 'CASCADE' })
  products: Product[];
}