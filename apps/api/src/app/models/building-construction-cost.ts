import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from './building.entity';
import { Product } from './product.entity';

@Entity()
export class BuildingConstructionCost {
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
