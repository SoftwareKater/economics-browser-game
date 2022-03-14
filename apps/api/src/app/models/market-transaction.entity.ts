import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { City } from './city.entity';
import { Product } from './product.entity';

/* eslint-disable @typescript-eslint/no-unused-vars */

@ObjectType()
@Entity()
export class MarketTransaction {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * The product that is traded
   */
  @Field((type) => Product)
  @ManyToOne(() => Product, (product) => product.transactions, {
    eager: true,
    primary: true,
  })
  product!: Product;

  /**
   * The selling city
   */
  @Field((type) => City)
  @ManyToOne(() => City, (city) => city.sellingTransactions)
  seller!: City;

  /**
   * The purchasing city
   */
  @Field((type) => City)
  @ManyToOne(() => City, (city) => city.purchasingTransactions)
  purchaser!: City;

  /**
   * Quantity traded
   */
  @Field((type) => Number)
  @Column({ type: 'float' })
  quantity!: number;

  /**
   * Trade price
   */
  @Field((type) => Number)
  @Column({ type: 'float' })
  price!: number;

  /**
   * The date and time that the transaction took place
   */
  @Field((type) => Date)
  @Column()
  date!: Date;

}
