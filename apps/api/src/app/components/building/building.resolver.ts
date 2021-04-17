import { Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BUILDINGS } from '../../mocks/buildings';
import { BuildingType } from '../../models/building-type.enum';
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
    return this.buildingRepository.find({
      where: { buildingType: BuildingType.ACCOMMODATION },
    });
  }

  @Query(() => [Building])
  async productionSites() {
    return this.buildingRepository.find({
      where: { buildingType: BuildingType.PRODUCTION_SITE },
    });
  }

  async initMockBuildings(): Promise<void> {
    for (const building of BUILDINGS) {
      try {
        await this.buildingRepository.save(building);
      } catch (err) {
        const errMsg: string = err.message;
        if (errMsg.startsWith('Duplicate entry')) {
          // console.warn(`Building ${building.name} already exists.`)
        } else {
          console.error(
            `Could not save mock building "${building.name}". Reson: `,
            errMsg
          );
        }
      }
    }
  }
}
