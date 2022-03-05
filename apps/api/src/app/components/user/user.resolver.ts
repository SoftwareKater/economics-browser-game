import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../../models/user.entity';
import { UserService } from './user.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { GqlCurrentUser } from '../auth/gql-current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
  ) {}

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

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async getUser(@GqlCurrentUser() user: User) {
    return this.userService.getUserById(user.id);
  }
}
