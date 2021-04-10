import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ObjectID, ObjectIdColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Product {
  @Field(type => String)
  @ObjectIdColumn()
  id!: ObjectID;

  @Field(type => String)
  @Column({
    unique: true
  })
  name!: string;
}