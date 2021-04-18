import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CityBuilding } from './city-building.entity';
import { CityProduct } from './city-product.entity';
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

  @Field((type) => [CityBuilding])
  @OneToMany(() => CityBuilding, (cityBuilding) => cityBuilding.city)
  developments!: CityBuilding[];

  @Field((type) => [CityProduct])
  @OneToMany(() => CityProduct, (cityProduct) => cityProduct.city)
  products!: CityProduct[];
}
