import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Building } from './building.entity';
import { City } from './city.entity';

/**
 * A city development is the creation of a building in a city.
 */
@ObjectType()
@Entity()
export class CityDevelopment {
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
  @ManyToOne(() => City, (city) => city.developments)
  city!: City;

  /**
   * UNIX timestamp of development date
   */
  @Field((type) => Date)
  @CreateDateColumn({})
  createdOn!: Date;
}
