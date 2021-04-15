import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CityDevelopment } from './city-development.entity';
import { Habitant } from './habitant.entity';

@ObjectType()
@Entity()
export class City {
  @Field((type) => String)
  @PrimaryGeneratedColumn("uuid")
  id!: string;


  @Field((type) => String)
  @Column({
    unique: true,
  })
  uuid!: string;

  @Field((type) => String)
  @Column()
  name!: string;

  @Field(type => [Habitant])
  @OneToMany(() => Habitant, habitant => habitant.city)
  habitants!: Habitant[];

  @Field(type => [CityDevelopment])
  @OneToMany(() => CityDevelopment, development => development.city)
  developments!: CityDevelopment[];
}
