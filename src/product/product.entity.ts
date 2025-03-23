import { ProductCategory } from '../product_cathegories/product_category.entity';
import { ProductSaleState } from '../product_sale_state/product_sale_state.entity';
import { ProductState } from '../product_state/product_state.entity';
import { User } from '../user/user.entity';
import { ProductLike } from '../product_like/product_like.entity';
import { UploadEntity } from '../upload/upload.entity';
import { ProductView } from '../product_view/product_view.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id_product: number;

  @Column()
  product_model: string;
  
  @Column()
  product_brand: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
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

  @OneToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'exchanged_product_id' })
  exchangedWith: Product;

  @ManyToOne(() => ProductCategory, (product_category) => product_category.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_category_product' })
  product_category: ProductCategory;

  @ManyToOne(() => ProductSaleState, (product_sale_state) => product_sale_state.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_sale_state_product' })
  product_sale_state: ProductSaleState;

  @ManyToOne(() => ProductState, (product_state) => product_state.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_state_product' })
  product_state: ProductState;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @ManyToOne(() => User, (user) => user.buyerProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_buyer' })
  buyer: User;

  @OneToMany(() => UploadEntity, (upload) => upload.product, { cascade: true })
  images: UploadEntity[];

  @OneToMany(() => ProductLike, (like) => like.product)
  likes: ProductLike[];

  @OneToMany(() => ProductView, (productView) => productView.product, { onDelete: 'CASCADE' })
  productViews: ProductView[];
}
  