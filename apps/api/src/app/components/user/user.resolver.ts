import { Args, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../models/user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  /**
   * @todo HASH THE F***ING PASSWORD
   * @param name
   * @param email
   * @param password
   * @returns
   */
  @Query(() => User)
  async createUser(
    @Args({ name: 'name', type: () => String }) name: string,
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string
  ): Promise<User> {
    return this.userRepository.create({ email, name, passwordHash: '****' });
  }

  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  @Query(() => User)
  async getUserById(
    @Args({ name: 'userId', type: () => String }) userId: string
  ): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }
}
