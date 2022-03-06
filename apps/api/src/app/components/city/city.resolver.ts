import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../../models/city.entity';
import { User } from '../../models/user.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { GqlCurrentUser } from '../auth/gql-current-user.decorator';
import { CityUpdateService } from './city-update.service';
import { CityService } from './city.service';

@Resolver(() => City)
export class CityResolver {
  constructor(
    private readonly cityService: CityService,
    private readonly cityUpdateService: CityUpdateService,
    @InjectRepository(City)
    private cityRepository: Repository<City>
  ) {}

  /**
   * @todo This needs to be secured with oauth, city to fetch should be read from token
   * @todo This query runs >20 sec and that needs to be reduced by at least 19sec
   *      Analysis: fetching one city with all its relations results in a typeorm query
   *      with #habitants x #buildings x #products result rows (way too much)
   * @returns The city of the player that send the query
   */
  @UseGuards(GqlAuthGuard)
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @Query((returns) => City, { name: 'getMyCity' })
  async getMyCity(@GqlCurrentUser() user: User) {
    const myCity = await this.cityRepository.findOneOrFail({
      where: { id: user.city.id },
      relations: ['habitants', 'buildings', 'products'],
    });
    return myCity;
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @Query((returns) => City, { name: 'getMyCityWithHabitants' })
  async getMyCityWithHabitants() {
    const myCity = await this.cityRepository.findOne({
      relations: ['habitants'],
    });
    return myCity;
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @Query((returns) => City, { name: 'getMyCityWithBuildings' })
  async getMyCityWithBuildings() {
    const myCity = await this.cityRepository.findOne({
      relations: ['buildings'],
    });
    return myCity;
  }

  @UseGuards(GqlAuthGuard)
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @Query((returns) => City, { name: 'getMyCityWithProducts' })
  async getMyCityWithProducts() {
    11;
    let myCity = await this.cityRepository.findOneOrFail();
    await this.cityUpdateService.updateCity(myCity.id);
    myCity = await this.cityRepository.findOneOrFail({
      relations: ['products'],
    });
    return myCity;
  }

  /**
   * Create a new building in the city
   * @todo implement construction time: start a counter and if the building is finished update city.development and(!) habitants.accommodation, habitants.employed
   * @param cityId
   * @param buildingId
   * @returns
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @Mutation((returns) => String, { name: 'createBuilding' })
  async createBuilding(
    @Args({ name: 'cityId', type: () => String }) cityId: string,
    @Args({ name: 'buildingId', type: () => String }) buildingId: string
  ): Promise<string | undefined> {
    try {
      return this.cityService.createBuilding(cityId, buildingId);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Destroy buildings in the city
   * @todo check if user is owner of the city that the buildings stand in
   * @param cityId
   * @param buildingId
   * @returns
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @Mutation((returns) => String, { name: 'deleteBuildings' })
  async deleteBuildings(
    @Args({ name: 'cityBuildingIds', type: () => [String] })
    cityBuildingIds: string[]
  ): Promise<number | undefined> {
    try {
      return this.cityService.destroyCityBuildings(cityBuildingIds);
    } catch (err) {
      console.error(err);
    }
  }
  /**
   * Delete a city by uuid
   * @param uuid the identifier of a city
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @Mutation((returns) => Boolean)
  async deleteCity(@Args({ name: 'uuid', type: () => String }) uuid: string) {
    const deleteResult = await this.cityRepository.delete(uuid);
    return deleteResult.affected === 1;
  }
}
