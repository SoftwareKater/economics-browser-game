import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { City } from './city.entity';
import { OfferStatus } from './offer-status.enum';
import { OfferType } from './offer-type.enum';
import { Product } from './product.entity';

/* eslint-disable @typescript-eslint/no-unused-vars */

@ObjectType()
@Entity()
export class Offer {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * The product that is offered / bid on
   */
  @Field((type) => Product)
  @ManyToOne(() => Product, (product) => product.offerings)
  product!: Product;

  /**
   * The offerer / bidder
   */
  @Field((type) => City)
  @ManyToOne(() => City, (city) => city.offers)
  provider!: City;

  /**
   * Quantity offered / bid
   */
  @Field((type) => Number)
  @Column({ type: 'float' })
  quantity!: number;

  /**
   * Price offered / bid
   */
  @Field((type) => Number)
  @Column({ type: 'float' })
  price!: number;

  /**
   * The type of this offer (offer / bid)
   */
  @Field((type) => OfferType)
  @Column({
    type: 'enum',
    enum: OfferType,
    default: OfferType.OFFER,
  })
  offerType!: OfferType;

  /**
   * The date and time that the offer was placed
   */
  @Field((type) => Date)
  @Column()
  datePlaced!: Date;

  /**
   * The date and time when this offer will expire
   */
  @Field((type) => Date)
  @Column()
  expirationDate!: Date;

  /**
   * The status of this offer
   */
  @Field((type) => OfferStatus)
  @Column({
    type: 'enum',
    enum: OfferStatus,
    default: OfferStatus.OPEN,
  })
  offerStatus!: OfferStatus;
}
