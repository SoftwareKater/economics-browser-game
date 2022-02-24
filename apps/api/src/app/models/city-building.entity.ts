import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Building } from './building.entity';
import { City } from './city.entity';
import { Habitant } from './habitant.entity';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * City Building
 * While the Building table only contains prototypes of the various buildings,
 * this table contains the actuals buildings that were built in a city.
 */
@ObjectType()
@Entity()
export class CityBuilding {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * The building (accommodation, production site, ...) that is developed
   */
  @Field((type) => Building)
  @ManyToOne(() => Building, (building) => building.developedIn, {
    eager: true,
  })
  building!: Building;

  /**
   * The city that the development was made in
   */
  @Field((type) => City)
  @ManyToOne(() => City, (city) => city.buildings)
  city!: City;

  /**
   * UNIX timestamp of development date
   */
  @Field((type) => Date)
  @CreateDateColumn({})
  createdOn!: Date;

  @Field((type) => [Habitant])
  @OneToMany(() => Habitant, (habitant) => habitant.employment)
  employees!: Habitant[];

  @Field((type) => [Habitant])
  @OneToMany(() => Habitant, (habitant) => habitant.accommodation)
  residents!: Habitant[];
}
