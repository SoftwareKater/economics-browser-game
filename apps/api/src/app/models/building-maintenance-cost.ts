import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from './building.entity';
import { Product } from './product.entity';

@Entity()
export class BuildingMaintenanceCost {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  buildingId!: number;

  @Column()
  productId!: number;

  @Column()
  amount!: number;

  @ManyToOne(() => Building, (building) => building.maintenanceCosts)
  building!: Building;

  @ManyToOne(() => Product, (product) => product.buildingMaintenanceCosts)
  product!: Product;
}
