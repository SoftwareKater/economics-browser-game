import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  ObjectID,
  ObjectIdColumn,
  OneToMany,
} from 'typeorm';
import { BuildingConstructionCost } from './building-construction-cost';
import { BuildingInput } from './building-input.entity';
import { BuildingMaintenanceCost } from './building-maintenance-cost';
import { BuildingOutput } from './building-output.entity';

@ObjectType()
@Entity()
export class Product {
  @Field((type) => String)
  @ObjectIdColumn()
  id!: ObjectID;

  @Field((type) => String)
  @Column({
    unique: true,
  })
  name!: string;

  @Field((type) => [BuildingInput])
  @OneToMany(() => BuildingInput, buildingInput => buildingInput.product)
  buildingInputs!: BuildingInput[];

  @Field((type) => [BuildingOutput])
  @OneToMany(() => BuildingOutput, buildingOutput => buildingOutput.product)
  buildingOutputs!: BuildingOutput[];

  @Field((type) => [BuildingConstructionCost])
  @OneToMany(() => BuildingConstructionCost, buildingConstructionCost => buildingConstructionCost.product)
  buildingConstructionCosts!: BuildingConstructionCost[];

  @Field((type) => [BuildingMaintenanceCost])
  @OneToMany(() => BuildingMaintenanceCost, buildingMaintenanceCost => buildingMaintenanceCost.product)
  buildingMaintenanceCosts!: BuildingMaintenanceCost[];

  //size
}
