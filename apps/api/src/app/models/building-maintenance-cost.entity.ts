import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from './building.entity';
import { Product } from './product.entity';

@ObjectType()
@Entity()
export class BuildingMaintenanceCost {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  amount!: number;

  @ManyToOne(() => Building, (building) => building.maintenanceCosts)
  building!: Building;

  @ManyToOne(() => Product, (product) => product.buildingMaintenanceCosts)
  product!: Product;
}
