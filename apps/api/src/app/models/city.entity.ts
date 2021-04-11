import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';
import { Habitant } from './habitant.entity';

@ObjectType()
@Entity()
export class City {
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

  @Field(type => [Habitant])
  @Column()
  habitants!: Habitant[];
}
