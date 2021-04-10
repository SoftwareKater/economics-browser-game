import { Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionSite } from '../../models/production-site.entity';
import { PRODUCTION_SITES } from '../../mocks/production-sites';

@Resolver(() => ProductionSite)
export class ProductionSiteResolver {
  constructor(

    @InjectRepository(ProductionSite)
    private productionSiteRepository: Repository<ProductionSite>
  ) {
    this.initMockProductionSites();
  }

  @Query(() => [ProductionSite])
  async productionSites() {
    return this.productionSiteRepository.find();
  }

  async initMockProductionSites(): Promise<void> {
    for (const accomm of PRODUCTION_SITES) {
      try {
        await this.productionSiteRepository.save(accomm);
      } catch (err) {
        console.warn(err.message);
      }
    }
  }
}
