import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';

/* eslint-disable @typescript-eslint/no-unused-vars */

@ObjectType()
@Entity()
export class User {
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field((type) => String)
  @Column()
  name!: string;

  @Field((type) => String)
  @Column()
  email!: string;

  @Field((type) => String)
  @Column()
  passwordHash!: string;

  /**
   * The city of the user
   */
  @Field((type) => City)
  @OneToOne(() => City, (city) => city.user, { eager: true })
  @JoinColumn()
  city!: City;
}
