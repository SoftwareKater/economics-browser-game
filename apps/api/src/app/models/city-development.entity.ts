import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { City } from './city.entity';

@ObjectType()
@Entity()
export class CityDevelopment {
  @Field((type) => String)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /**
   * Can be the id of any building (accommodation, production site, ...)
   */
  @Field((type) => String)
  @Column()
  buildingId!: string;

  /**
   * The city that the development was made in
   */
  @Field((type) => City)
  @ManyToOne(() => City, (city) => city.developments)
  city!: City;

  /**
   * UNIX timestamp of creation date
   */
  @Field((type) => Int)
  @Column()
  createdOn!: number;
}
