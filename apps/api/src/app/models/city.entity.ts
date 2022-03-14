import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { CityBuilding } from './city-building.entity';
import { CityProduct } from './city-product.entity';
import { Habitant } from './habitant.entity';
import { MarketTransaction } from './market-transaction.entity';
import { Offer } from './offer.entity';
import { User } from './user.entity';

/* eslint-disable @typescript-eslint/no-unused-vars */

@ObjectType()
@Entity()
export class City {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field((type) => String)
  @Column()
  name!: string;

  @Field((type) => [Habitant])
  @OneToMany(() => Habitant, (habitant) => habitant.city)
  habitants!: Habitant[];

  @Field((type) => [CityBuilding])
  @OneToMany(() => CityBuilding, (cityBuilding) => cityBuilding.city)
  buildings!: CityBuilding[];

  @Field((type) => [CityProduct])
  @OneToMany(() => CityProduct, (cityProduct) => cityProduct.city)
  products!: CityProduct[];

  @Field((type) => Date)
  @Column()
  lastCityUpdate!: Date;

  /**
   * The owner of the city
   */
  @Field((type) => User)
  @OneToOne(() => User, (user) => user.city)
  user!: User;

  /**
   * All offers of this city
   */
  @Field((type) => [Offer])
  @OneToMany(() => Offer, (offer) => offer.provider)
  offers!: Offer[];

  /**
   * The transaction where the city was the purchaser
   */
  @Field((type) => [MarketTransaction])
  @OneToMany(() => MarketTransaction, (marketTransaction) => marketTransaction.purchaser)
  purchasingTransactions!: MarketTransaction[];

  /**
   * The transaction where the city was the seller
   */
  @Field((type) => [MarketTransaction])
  @OneToMany(() => MarketTransaction, (marketTransaction) => marketTransaction.seller)
  sellingTransactions!: MarketTransaction[];
}
