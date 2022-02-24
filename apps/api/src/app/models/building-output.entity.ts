import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from './building.entity';
import { Product } from './product.entity';

/* eslint-disable @typescript-eslint/no-unused-vars */

@ObjectType()
@Entity()
export class BuildingOutput {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Amount per hour
   */
  @Field((type) => Number)
  @Column()
  amount!: number;

  @Field((type) => Building)
  @ManyToOne(() => Building, (building) => building.outputs)
  building!: Building;

  @Field((type) => Product)
  @ManyToOne(() => Product, (product) => product.buildingOutputs, {
    eager: true,
  })
  product!: Product;
}
