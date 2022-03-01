import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../../models/city.entity';
import { User } from '../../models/user.entity';
import { CityCreationService } from '../city/city-creation.service';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  /**
   * @todo HASH THE F***ING PASSWORD
   * @param name
   * @param email
   * @param password
   * @returns
   */
  @Mutation(() => Boolean)
  async createUser(
    @Args({ name: 'nickName', type: () => String }) nickName: string,
    @Args({ name: 'cityName', type: () => String }) cityName: string,
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string
  ): Promise<boolean | undefined> {
    try {
      return this.userService.createUserAndCity({
        nickName,
        cityName,
        email,
        password,
      });
    } catch (err: any) {
      console.error(err);
    }
  }

  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return this.userService.get();
  }

  @Query(() => User)
  async getUserById(
    @Args({ name: 'userId', type: () => String }) userId: string
  ): Promise<User | undefined> {
    return this.userService.getUserById(userId);
  }

  @Query(() => User)
  async getUserByEmail(
    @Args({ name: 'email', type: () => String }) email: string
  ): Promise<User | undefined> {
    console.log("Getting user by email")
    try {
      const res = await this.userService.getUserByEmail(email);
      console.log('Found user', res);
      return res;
    } catch (err: any) {
      console.error(err);
    }
  }

  /**
   * @todo HASH AND COMPARE THE F***ING PASSWORD
   * @param name
   * @param email
   * @param password
   * @returns
   */
   @Mutation(() => User)
   async login(
     @Args({ name: 'email', type: () => String }) email: string,
     @Args({ name: 'password', type: () => String }) password: string
   ): Promise<User | undefined> {
     try {
       return this.userService.getUserByEmail(email);
     } catch (err: any) {
       console.error(err);
     }
   }
}
