import { ProductCategory } from '../product_cathegories/product_category.entity';
import { ProductSaleState } from '../product_sale_state/product_sale_state.entity';
import { ProductState } from '../product_state/product_state.entity';
import { User } from '../user/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
  
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id_product: number;

  @Column()
  product_model: string;
  
  @Column()
  product_brand: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude_created: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude_created: number;

  @Column()
  name_city_created: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  last_updated: Date;

  @ManyToOne(() => ProductCategory, (product_category) => product_category.products)
  @JoinColumn({ name: 'id_category_product' })
  product_category: ProductCategory;

  @ManyToOne(() => ProductSaleState, (product_sale_state) => product_sale_state.products)
  @JoinColumn({ name: 'id_sale_state_product' })
  product_sale_state: ProductSaleState;

  @ManyToOne(() => ProductState, (product_state) => product_state.products)
  @JoinColumn({ name: 'id_state_product' })
  product_state: ProductState;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'id_user' })
  user: User;
}
  