import { Product } from '../product/product.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';
  
@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id_category_product: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Product, (product) => product.product_category, { onDelete: 'CASCADE' })
  products: Product[];
}