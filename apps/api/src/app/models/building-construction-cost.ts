import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from './building.entity';
import { Product } from './product.entity';

@ObjectType()
@Entity()
export class BuildingConstructionCost {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  buildingId!: number;

  @Column()
  productId!: number;

  @Column()
  amount!: number;

  @ManyToOne(() => Building, (building) => building.constructionCosts)
  building!: Building;

  @ManyToOne(() => Product, (product) => product.buildingConstructionCosts)
  product!: Product;
}
