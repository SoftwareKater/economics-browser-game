import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from './building.entity';
import { Product } from './product.entity';

@Entity()
export class BuildingOutput {
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
