import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from './building.entity';
import { City } from './city.entity';

@ObjectType()
@Entity()
export class Habitant {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field((type) => String)
  @Column()
  name!: string;

  @Field((type) => City)
  @ManyToOne(() => City, (city) => city.habitants)
  city!: City;

  /**
   * If this habitant is employed, this field holds the production site it is employed with.
   * If this field is undefined/null, the habitant is currently unemployed.
   */
  @Field((type) => Building, {
    nullable: true,
  })
  @ManyToOne(() => Building, (building) => building.employees, {
    nullable: true,
  })
  employment?: Building;

  /**
   * Number of days that this habitant is starving
   * If this field is greater than 1, the habitant is starving
   */
  @Field((type) => Int)
  @Column()
  starving!: number;

  /**
   * The habitants accommodation.
   * If this field is undefined/null, the habitant is currently homeless.
   */
  @Field((type) => Building, {
    nullable: true,
  })
  @ManyToOne(() => Building, (building) => building.residents, {
    nullable: true,
  })
  accommodation?: Building;
}
