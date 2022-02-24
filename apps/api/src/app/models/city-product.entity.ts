import { Field, Float, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { City } from './city.entity';
import { Product } from './product.entity';

/**
 * City Product
 * While the Product table only contains prototypes of the various products,
 * this table contains the actual products that are owned by a city.
 */
@ObjectType()
@Entity()
export class CityProduct {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * The product (accommodation, production site, ...) that is developed
   */
  @Field((type) => Product)
  @ManyToOne(() => Product, (product) => product.ownedBy, {
    eager: true,
    primary: true,
  })
  product!: Product;

  /**
   * The city that the development was made in
   */
  @Field((type) => City)
  @ManyToOne(() => City, (city) => city.products)
  city!: City;

  /**
   * Amount of the product owned by the city
   */
  @Field((type) => Number)
  @Column({ type: 'float' })
  amount!: number;

  @Field((type) => Date)
  @UpdateDateColumn()
  lastUpdate!: Date;

  /**
   * If false, this product can only be used via direct action on the client by the player
   * (e.g. construction a building, trade on the market), but cannot be used by habitants
   * as food, or by production sites as inputs, or any other automatic game-controled mechanism.
   */
  @Field((type) => Boolean)
  @Column({ default: true })
  allow!: boolean;
}
