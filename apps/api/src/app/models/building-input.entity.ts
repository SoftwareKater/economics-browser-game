import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from './building.entity';
import { Product } from './product.entity';

@ObjectType()
@Entity()
export class BuildingInput {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  buildingId!: string;

  @Column()
  productId!: string;

  @Column()
  amount!: number;

  @ManyToOne(() => Building, (building) => building.inputs)
  building!: Building;

  @ManyToOne(() => Product, (product) => product.buildingInputs)
  product!: Product;
}
