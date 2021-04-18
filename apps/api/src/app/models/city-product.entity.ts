import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
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
  @Column()
  amount!: number;
}
