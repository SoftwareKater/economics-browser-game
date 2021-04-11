import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';

@ObjectType()
@Entity()
export class CityDevelopment {
  /**
   * Can be the id of any building (accommodation, production site, ...)
   */
  @Field((type) => String)
  @Column()
  buildingId!: string;

  /**
   * The number of buildings of this type
   */
  @Field((type) => Int)
  @Column()
  amount!: number;
}
