import { Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BUILDINGS } from '../../mocks/buildings';
import { PRODUCTS } from '../../mocks/products';
import { BuildingConstructionCost } from '../../models/building-construction-cost.entity';
import { BuildingInput } from '../../models/building-input.entity';
import { BuildingMaintenanceCost } from '../../models/building-maintenance-cost.entity';
import { BuildingOutput } from '../../models/building-output.entity';
import { BuildingType } from '../../models/building-type.enum';
import { Building } from '../../models/building.entity';
import { Product } from '../../models/product.entity';

@Resolver(() => Building)
export class BuildingResolver {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>
  ) {}

  @Query(() => [Building])
  async accommodations() {
    return this.buildingRepository.find({
      where: { buildingType: BuildingType.ACCOMMODATION },
      relations: ['maintenanceCosts'],
    });
  }

  @Query(() => [Building])
  async productionSites() {
    return this.buildingRepository.find({
      where: { buildingType: BuildingType.PRODUCTION_SITE },
      relations: ['inputs', 'outputs'],
    });
  }
}
