import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ObjectID, ObjectIdColumn, ManyToOne } from 'typeorm';
import { Building } from './building.entity';

@ObjectType()
@Entity()
export class Habitant {
  @Field((type) => String)
  @ObjectIdColumn()
  id!: ObjectID;

  @Field((type) => String)
  @Column({
    unique: true,
  })
  uuid!: string;

  @Field((type) => String)
  @Column()
  name!: string;

  /**
   * True, if this habitant is currently unemployed
   */
  @Field((type) => Boolean)
  @Column()
  unemployed!: boolean;

  /**
   * Number of days that this habitant is unemployed
   */
  @Field((type) => Int)
  @Column()
  unemployedFor!: number;

  /**
   * If this habitant is employed, this field holds the production site it is employed with
   */
  @Field((type) => Building, {
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  employment?: Building;

  /**
   * True, if this habitant is currently starving
   */
  @Field((type) => Boolean)
  @Column()
  starving!: boolean;

  /**
   * Number of days that this habitant is starving
   */
  @Field((type) => Int)
  @Column()
  starvingFor!: number;

  /**
   * True, if this habitant is currently homeless
   */
  @Field((type) => Boolean)
  @Column()
  homeless!: boolean;

  /**
   * Number of days that this habitant is homeless
   */
  @Field((type) => Int)
  @Column()
  homelessFor!: number;

  /**
   * The habitants accommodation
   */
  @Field((type) => Building)
  @Column()
  accommodation!: Building;

  /**
   * The base productivty of this habitant
   */
  @Field((type) => Float)
  @Column()
  baseProductivity!: number;
}
