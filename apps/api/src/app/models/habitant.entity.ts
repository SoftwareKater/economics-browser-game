import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { Building } from './building.entity';

@ObjectType()
@Entity()
export class Habitant {
  @Field((type) => String)
  @Column({
    unique: true,
  })
  uuid!: string;

  @Field((type) => String)
  @Column()
  name!: string;

  /**
   * If this habitant is employed, this field holds the production site it is employed with.
   * If this field is undefined/null, the habitant is currently unemployed.
   */
  @Field((type) => Building, {
    nullable: true,
  })
  @Column({
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
  @Column({
    nullable: true,
  })
  accommodation?: Building;
}
