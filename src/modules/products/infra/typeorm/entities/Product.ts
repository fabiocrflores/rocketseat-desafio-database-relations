import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';
import { ColumnNumericTransformer } from '@shared/infra/typeorm/ColumnNumericTransformer';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column("decimal", { precision: 5, scale: 2 })
  price: number;

  @Column("numeric", {
    transformer: new ColumnNumericTransformer(),
  })
  quantity: number;

  @OneToMany(() => OrdersProducts, orderProduct => orderProduct.product_id)
  order_products: OrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
