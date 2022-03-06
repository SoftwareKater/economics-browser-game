import { UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityProduct } from '../../models/city-product.entity';
import { User } from '../../models/user.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { GqlCurrentUser } from '../auth/gql-current-user.decorator';

export class CityProductResolver {
  constructor(
    @InjectRepository(CityProduct)
    private cityProductRepository: Repository<CityProduct>
  ) {}

  @UseGuards(GqlAuthGuard)
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @Query((returns) => [CityProduct], { name: 'getMyCityProducts' })
  public async getMyCityProducts(
    @GqlCurrentUser() user: User
  ): Promise<CityProduct[]> {
    return this.cityProductRepository.find({ where: { city: { id: user.city.id } } });
  }
}
