import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Resolver(() => String)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}
  /**
   * @todo HASH AND COMPARE THE F***ING PASSWORD
   * @param name
   * @param email
   * @param password
   * @returns
   */
  // @UseGuards(LocalAuthGuard)
  @Mutation(() => String)
  async login(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string
  ): Promise<string | undefined> {
    return this.authService.login(email, password);
  }
}
