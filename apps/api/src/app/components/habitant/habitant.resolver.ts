import { Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habitant } from '../../models/habitant.entity';

@Resolver(() => Habitant)
export class HabitantResolver {
  constructor(
    @InjectRepository(Habitant)
    private habitantRepository: Repository<Habitant>
  ) {}

  @Query(() => [Habitant])
  async habitants() {
    return this.habitantRepository.find();
  }
}
