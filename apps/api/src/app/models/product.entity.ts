import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BuildingConstructionCost } from './building-construction-cost.entity';
import { BuildingInput } from './building-input.entity';
import { BuildingMaintenanceCost } from './building-maintenance-cost.entity';
import { BuildingOutput } from './building-output.entity';
import { CityProduct } from './city-product.entity';
import { MarketTransaction } from './market-transaction.entity';
import { Offer } from './offer.entity';

/* eslint-disable @typescript-eslint/no-unused-vars */

@ObjectType()
@Entity()
export class Product {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field((type) => String)
  @Column({
    unique: true,
  })
  name!: string;

  @Field((type) => Boolean)
  @Column()
  consumable!: boolean;

  @Field((type) => Number)
  @Column()
  nutritionalValue!: number;

  @Field((type) => [BuildingInput])
  @OneToMany(() => BuildingInput, (buildingInput) => buildingInput.product)
  buildingInputs!: BuildingInput[];

  @Field((type) => [BuildingOutput])
  @OneToMany(() => BuildingOutput, (buildingOutput) => buildingOutput.product)
  buildingOutputs!: BuildingOutput[];

  @Field((type) => [BuildingConstructionCost])
  @OneToMany(
    () => BuildingConstructionCost,
    (buildingConstructionCost) => buildingConstructionCost.product
  )
  buildingConstructionCosts!: BuildingConstructionCost[];

  @Field((type) => [BuildingMaintenanceCost])
  @OneToMany(
    () => BuildingMaintenanceCost,
    (buildingMaintenanceCost) => buildingMaintenanceCost.product
  )
  buildingMaintenanceCosts!: BuildingMaintenanceCost[];

  @Field((type) => [CityProduct])
  @OneToMany(() => CityProduct, (cityProduct) => cityProduct.product)
  ownedBy!: CityProduct[];

  /**
   * The offerings (offers / bids) for this product
   */
  @Field((type) => [Offer])
  @OneToMany(() => Offer, (offer) => offer.product)
  offerings!: Offer[];

  /**
   * The transaction that this product is part of
   */
  @Field((type) => [MarketTransaction])
  @OneToMany(
    () => MarketTransaction,
    (marketTransaction) => marketTransaction.product
  )
  transactions!: MarketTransaction[];
}
