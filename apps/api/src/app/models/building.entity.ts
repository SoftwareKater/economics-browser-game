import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BuildingConstructionCost } from './building-construction-cost';
import { BuildingInput } from './building-input.entity';
import { BuildingMaintenanceCost } from './building-maintenance-cost';
import { BuildingOutput } from './building-output.entity';
import { BuildingType } from './building-type.enum';

/* disable-eslint @typescript-eslint/no-unsued-vars */

/**
 * All buildings in economics1k.
 * Will be filled when the game is started for the first time. Has no relations to any other table.
 */
@ObjectType()
@Entity()
export class Building {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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
   * The number of products that can be stored (only applies to storages)
   */
  @Field((type) => Int)
  @Column()
  capacity!: number;

  /**
   * The number of habitants that can work in this production site
   */
  @Field((type) => Int)
  @Column()
  places!: number;

  /**
   * The inputs that are needed per day (only applies to production sites)
   */
  @Field((type) => [BuildingInput])
  @OneToMany(() => BuildingInput, (buildingInput) => buildingInput.building)
  inputs!: BuildingInput[];

  /**
   * The outputs that are produced each day (only applies to production sites)
   */
  @Field((type) => [BuildingOutput])
  @OneToMany(() => BuildingOutput, (buildingOutput) => buildingOutput.building)
  outputs!: BuildingOutput[];

  @Field((type) => [BuildingConstructionCost])
  @OneToMany(
    () => BuildingConstructionCost,
    (buildingConstructionCost) => buildingConstructionCost.building
  )
  constructionCosts!: BuildingConstructionCost[];

  @Field((type) => Float)
  @Column()
  constructionTime!: number;

  /**
   * Only applies for accommodations (not for production-sites and storages)
   */
  @Field((type) => Float)
  @Column()
  productivityMultiplicator!: number;

  /**
   * Only applies for accommodations and storages (not for production-sites)
   */
  @Field((type) => [BuildingMaintenanceCost])
  @OneToMany(
    () => BuildingMaintenanceCost,
    (buildingMaintenance) => buildingMaintenance.building
  )
  maintenanceCosts!: BuildingMaintenanceCost[];

  /**
   * The type of this building (accommodation, storage, production-site)
   */
  @Field((type) => BuildingType)
  @Column({
    type: 'enum',
    enum: BuildingType,
    default: BuildingType.ACCOMMODATION,
  })
  buildingType!: BuildingType;
}
