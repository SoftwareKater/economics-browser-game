import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../../models/city.entity';
import { CityService } from './city.service';

@Resolver(() => City)
export class CityResolver {
  constructor(
    private readonly cityService: CityService,
    @InjectRepository(City)
    private cityRepository: Repository<City>
  ) {}

  @Query(() => [City], { name: 'cities' })
  async cities() {
    return this.cityRepository.find();
  }

  /**
   * @todo This needs to be secured with oauth, city to fetch should be read from token
   * @todo This query runs >20 sec and that needs to be reduced by at least 19sec
   *      Analysis: fetching one city with all its relations results in a typeorm query
   *      with #habitants x #buildings x #products result rows (way too much)
   * @returns The city of the player that send the query
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @Query((returns) => City, { name: 'getMyCity' })
  async getMyCity() {
    const myCity = await this.cityRepository.findOne({
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

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @Query((returns) => City, { name: 'getMyCityWithProducts' })
  async getMyCityWithProducts() {
    11;
    let myCity = await this.cityRepository.findOneOrFail();
    await this.cityService.updateCity(myCity.id);
    myCity = await this.cityRepository.findOneOrFail({
      relations: ['products'],
    });
    return myCity;
  }

  // @Query((returns) => CityCounts)
  // async getMyCityCounts(
  //   @Args({ name: 'cityId', type: () => String }) cityId: string
  // ) {
  //   const myHabitants = await this.habitantRepository.find({
  //     city: { id: cityId },
  //   });
  // }

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
    // @todo start a counter and if the building is finished update city.development and(!) habitants.accommodation, habitants.employed
  }

  /**
   * @param name
   * @returns
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @Mutation((returns) => String, { name: 'createCity' })
  async createCity(@Args({ name: 'name', type: () => String }) name: string) {
    return this.cityService.createCity(name);
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
