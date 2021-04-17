import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from './building.entity';
import { Product } from './product.entity';

@ObjectType()
@Entity()
export class BuildingOutput {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  buildingId!: number;

  @Column()
  productId!: number;

  @Column()
  amount!: number;

  @ManyToOne(() => Building, (building) => building.outputs)
  building!: Building;

  @ManyToOne(() => Product, (product) => product.buildingOutputs)
  product!: Product;
}
