import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BuildingConstructionCost } from './building-construction-cost.entity';
import { BuildingInput } from './building-input.entity';
import { BuildingMaintenanceCost } from './building-maintenance-cost.entity';
import { BuildingOutput } from './building-output.entity';
import { BuildingType } from './building-type.enum';
import { CityBuilding } from './city-building.entity';
import { Habitant } from './habitant.entity';

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
   * The number of products that can be stored (only applies to storages).
   * If zero (default), the building cannot store anything (accommodation, production site)
   * @todo when this mechanic is ever introduced: products should have a size.
   */
  @Field((type) => Int)
  @Column({
    default: 0,
  })
  capacity?: number;

  /**
   * The number of habitants that can work in this production site,
   * or the number of habitants that can live in this accommodation.
   * If zero (default), habitants can neither work nor live in the building (storage)
   */
  @Field((type) => Int)
  @Column({
    default: 0,
  })
  places?: number;

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
    (buildingConstructionCost) => buildingConstructionCost.building,
    { eager: true }
  )
  constructionCosts!: BuildingConstructionCost[];

  /**
   * Time to construct this building in ticks (or sec)?
   * @todo how is this done in browser games?
   */
  @Field((type) => Float)
  @Column()
  constructionTime!: number;

  /**
   * Only applies for accommodations (not for production-sites and storages).
   * If zero (default), the building has no impact on productivity (production site, storage)
   */
  @Field((type) => Float)
  @Column({ type: 'float', default: 0 })
  productivityMultiplicator?: number;

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

  @Field((type) => [CityBuilding])
  @OneToMany(() => CityBuilding, (cityDevel) => cityDevel.building)
  developedIn!: CityBuilding[];

  /**
   * if negative (default), there is no maximum amount for this building.
   */
  @Field((type) => Number)
  @Column({ default: -1 })
  maxPerCity!: number;
}
