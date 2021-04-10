import { Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accommodation } from '../../entities/accommodation.entity';
import { Product } from '../../entities/product.entity';
import { ACCOMMODATIONS } from '../../mocks/accommodations';

@Resolver(() => Accommodation)
export class AccommodationResolver {
  constructor(

    @InjectRepository(Accommodation)
    private accommodationRepository: Repository<Product>
  ) {
    this.initMockAccommodations();
  }

  @Query(() => [Accommodation])
  async accommodations() {
    return this.accommodationRepository.find();
  }

  async initMockAccommodations(): Promise<void> {
    for (const accomm of ACCOMMODATIONS) {
      try {
        await this.accommodationRepository.save(accomm);
      } catch (err) {
        console.warn(err.message);
      }
    }
  }
}
