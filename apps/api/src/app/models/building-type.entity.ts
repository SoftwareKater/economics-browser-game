import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';

@ObjectType()
@Entity()
export class BuildingType {
  @Field((type) => String)
  @ObjectIdColumn()
  id!: ObjectID;

  @Field((type) => String)
  @Column({
    unique: true,
  })
  name!: string;
}
