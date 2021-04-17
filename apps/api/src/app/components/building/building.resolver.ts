import { Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BUILDINGS } from '../../mocks/buildings';
import { Building } from '../../models/building.entity';

@Resolver(() => Building)
export class BuildingResolver {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>
  ) {
    this.initMockBuildings();
  }

  @Query(() => [Building])
  async accommodations() {
    return this.buildingRepository.find();
  }

  @Query(() => [Building])
  async productionSites() {
    return this.buildingRepository.find();
  }

  async initMockBuildings(): Promise<void> {
    for (const building of BUILDINGS) {
      try {
        await this.buildingRepository.save(building);
      } catch (err) {
        console.warn(err.message);
      }
    }
  }
}
