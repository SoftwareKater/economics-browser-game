import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CityBuilding } from './city-building.entity';
import { CityProduct } from './city-product.entity';
import { Habitant } from './habitant.entity';

/* eslint-disable @typescript-eslint/no-unused-vars */

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

  @Field((type) => [CityBuilding])
  @OneToMany(() => CityBuilding, (cityBuilding) => cityBuilding.city)
  buildings!: CityBuilding[];

  @Field((type) => [CityProduct])
  @OneToMany(() => CityProduct, (cityProduct) => cityProduct.city)
  products!: CityProduct[];

  @Field((type) => Date)
  @Column()
  lastCityUpdate!: Date;
}
