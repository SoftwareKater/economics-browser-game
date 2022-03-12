import { Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuildingType } from '../../models/building-type.enum';
import { Building } from '../../models/building.entity';

/**
 * Endpoints to GET buildings
 * (on purpose un-authenticated)
 */
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
      relations: ['constructionCosts', 'maintenanceCosts'],
    });
  }

  @Query(() => [Building])
  async productionSites() {
    return this.buildingRepository.find({
      where: { buildingType: BuildingType.PRODUCTION_SITE },
      relations: ['constructionCosts', 'inputs', 'outputs'],
    });
  }
}
