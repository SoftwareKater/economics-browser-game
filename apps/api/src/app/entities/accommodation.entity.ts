import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';
import { ProductAmount } from './product-amount.entity';

/* disable-eslint @typescript-eslint/no-unsued-vars */

@ObjectType()
@Entity()
export class Accommodation {
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
   * The number of habitants that can live in this accommodation
   */
  @Field((type) => Int)
  @Column()
  capacity!: number;

  @Field((type) => Float)
  @Column()
  productivityMultiplicator!: number;

  @Field((type) => [ProductAmount])
  @Column()
  constructionCosts?: ProductAmount[];

  @Field((type) => Float)
  @Column()
  constructionTime!: number;

  @Field((type) => [ProductAmount])
  @Column()
  maintenanceCosts!: ProductAmount[];
}
