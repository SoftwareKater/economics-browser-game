import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from './building.entity';
import { Product } from './product.entity';

/* eslint-disable @typescript-eslint/no-unused-vars */

@ObjectType()
@Entity()
export class BuildingMaintenanceCost {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field((type) => Number)
  @Column()
  amount!: number;

  @Field((type) => Building)
  @ManyToOne(() => Building, (building) => building.maintenanceCosts)
  building!: Building;

  @Field((type) => Product)
  @ManyToOne(() => Product, (product) => product.buildingMaintenanceCosts, {
    eager: true,
  })
  product!: Product;
}
