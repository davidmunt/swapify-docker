import { Product } from '../product/product.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';
  
@Entity()
export class ProductSaleState {
  @PrimaryGeneratedColumn()
  id_sale_state_product: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Product, (product) => product.product_sale_state, { onDelete: 'CASCADE' })
  products: Product[];
}