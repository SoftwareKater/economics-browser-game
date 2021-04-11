import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';
import { BuildingType } from './building-type.entity';
import { ProductAmount } from './product-amount.entity';

/* disable-eslint @typescript-eslint/no-unsued-vars */

@ObjectType()
@Entity()
export class Building {
  @Field((type) => String)
  @ObjectIdColumn()
  id!: ObjectID;

  @Field((type) => String)
  @Column({
    unique: true,
  })
  name!: string;

  @Field((type) => String)
  @Column()
  description!: string;

  /**
   * The size in square meters
   */
  @Field((type) => Int)
  @Column()
  size!: number;

  /**
   * The number of products that can be stored (only applies to storages)
   */
  @Field((type) => Int)
  @Column()
  capacity!: number;

  /**
   * The number of habitants that can work in this production site
   */
  @Field((type) => Int)
  @Column()
  places!: number;

  /**
   * The inputs that are needed per day (only applies to production sites)
   */
  @Field((type) => [ProductAmount])
  @Column()
  inputs!: ProductAmount[];

  /**
   * The outputs that are produced each day (only applies to production sites)
   */
  @Field((type) => [ProductAmount])
  @Column()
  outputs!: ProductAmount[];

  @Field((type) => [ProductAmount])
  @Column()
  constructionCosts!: ProductAmount[];

  @Field((type) => Float)
  @Column()
  constructionTime!: number;

  /**
   * Only applies for accommodations (not for production-sites and storages)
   */
  @Field((type) => Float)
  @Column()
  productivityMultiplicator!: number;

  /**
   * Only applies for accommodations and storages (not for production-sites)
   */
  @Field((type) => [ProductAmount])
  @Column()
  maintenanceCosts!: ProductAmount[];

  /**
   * The type of this building (accommodation, storage, production-site)
   */
   @Field((type) => BuildingType)
   @Column()
   buildingType!: BuildingType;
}
