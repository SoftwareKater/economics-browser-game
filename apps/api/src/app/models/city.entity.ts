import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CityDevelopment } from './city-development.entity';
import { Habitant } from './habitant.entity';

/**
 * @todo maybe habitants and developments should be "eager", so habitants will always be fetched together with the city
 */
@ObjectType()
@Entity()
export class City {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field((type) => String)
  @Column()
  name!: string;

  @Field((type) => [Habitant])
  @OneToMany(() => Habitant, (habitant) => habitant.city)
  habitants!: Habitant[];

  @Field((type) => [CityDevelopment])
  @OneToMany(() => CityDevelopment, (development) => development.city)
  developments!: CityDevelopment[];
}
