import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';
import { ProductAmount } from './product-amount.entity';

/* disable-eslint @typescript-eslint/no-unsued-vars */

@ObjectType()
@Entity()
export class ProductionSite {
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
   * The number of habitants that can work in this production site
   */
  @Field((type) => Int)
  @Column()
  capacity!: number;

  /**
   * The inputs that are needed per day
   */
  @Field((type) => [ProductAmount])
  @Column()
  inputs!: ProductAmount[];

  /**
   * The outputs that are produced each day
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
}
