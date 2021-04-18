import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { v4 as uuidv4 } from 'uuid';
import { CityBuilding } from '../../models/city-building.entity';
import { Building } from '../../models/building.entity';
import { Product } from '../../models/product.entity';
import { CityProduct } from '../../models/city-product.entity';
import { CityService } from './city.service';

@Resolver(() => City)
export class CityResolver {
  constructor(
    private readonly cityService: CityService,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(CityBuilding)
    private cityDevelRepository: Repository<CityBuilding>,
    @InjectRepository(CityProduct)
    private cityProductRepository: Repository<CityProduct>,
    @InjectRepository(Habitant)
    private habitantRepository: Repository<Habitant>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  @Query(() => [City], { name: 'cities' })
  async cities() {
    return this.cityRepository.find();
  }

  /**
   * @todo This needs to be secured with oauth, city to fetch should be read from token
   * @returns The city of the player that send the query
   */
  @Query((returns) => City, { name: 'getMyCity' })
  async getMyCity() {
    const allCities = await this.cityRepository.find({
      relations: ['habitants', 'developments', 'products'],
    });
    if (!allCities || allCities.length < 1) {
      throw new Error('404 not found');
    }
    const myCity = allCities[0];
    return myCity;
  }

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
   * @todo refactor this method!!!
   * @param name
   * @returns
   */
  @Mutation((returns) => City, { name: 'createCity' })
  async createCity(@Args({ name: 'name', type: () => String }) name: string) {
    return this.cityService.createCity(name);
  }

  /**
   * Delete a city by uuid
   * @param uuid the identifier of a city
   */
  @Mutation((returns) => Boolean)
  async deleteCity(@Args({ name: 'uuid', type: () => String }) uuid: string) {
    const deleteResult = await this.cityRepository.delete(uuid);
    return deleteResult.affected === 1;
  }
}
