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

@Resolver(() => City)
export class CityResolver {
  constructor(
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
    private productRepository: Repository<Product>,
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

  // @Mutation((returns) => City, { name: 'createBuilding' })
  // async createBuilding(
  //   @Args({ name: 'cityId', type: () => String }) cityId: string,
  //   @Args({ name: 'buildingId', type: () => String }) buildingId: string
  // ) {
  //   const now = new Date().getTime();
  //   this.cityDevelRepository.update(cityId, {
  //     buildingId,
  //     city: { id: cityId },
  //     createdOn: now,
  //   });
  //   // @todo start a counter and if the building is finished update city.development and(!) habitants.accommodation, habitants.employed
  // }

  /**
   * @todo refactor this method!!!
   * @param name
   * @returns
   */
  @Mutation((returns) => City, { name: 'createCity' })
  async createCity(@Args({ name: 'name', type: () => String }) name: string) {
    const newCity: Partial<City> = {
      name,
    };

    // Habitants of the new city
    const habitants: Partial<Habitant>[] = [];
    let habitant: Partial<Habitant>;
    for (let i = 1; i <= 10000; i++) {
      habitant = {
        // id: uuidv4(),
        name: `Habitant ${i}`,
        accommodation: undefined,
        starving: 0,
        employment: undefined,
        city: newCity as City,
      };
      habitants.push(habitant);
    }

    // Initial development of the city
    const well = await this.buildingRepository.findOne({
      where: { name: 'well' },
    });
    const shack = await this.buildingRepository.findOne({
      where: { name: 'shack' },
    });
    if (!shack || !well) {
      return console.error(
        'Could not find buildings for inital development of the city. Aborting city creation.'
      );
    }
    const developments: Partial<CityBuilding>[] = [
      {
        building: well,
        city: newCity as City,
      },
      {
        building: shack,
        city: newCity as City,
      },
      {
        building: shack,
        city: newCity as City,
      },
      {
        building: shack,
        city: newCity as City,
      },
    ];

    // Initial Products of the new city
    const wood = await this.productRepository.findOne({
      where: { name: 'wood' },
    });
    const stone = await this.productRepository.findOne({
      where: { name: 'stone' },
    });
    if (!wood || !stone) {
      return console.error(
        'Could not find buildings for inital development of the city. Aborting city creation.'
      );
    }
    const products: Partial<CityProduct>[] = [
      {
        amount: 100,
        city: newCity as City,
        product: wood,
      },
      {
        amount: 100,
        city: newCity as City,
        product: stone,
      }
    ];

    let insertResult: (Partial<City> & City) | undefined = undefined;
    try {
      insertResult = await this.cityRepository.save(newCity);
      await this.habitantRepository.insert(habitants);
      await this.cityDevelRepository.insert(developments);
      await this.cityProductRepository.insert(products);
    } catch (err) {
      // Revert everything and log error
      this.cityProductRepository.delete({ city: newCity });
      this.cityDevelRepository.delete({ city: newCity });
      this.habitantRepository.delete({ city: newCity });
      if (insertResult) {
        this.cityRepository.delete({ id: insertResult.id });
      }
      return console.error(err.message);
    }
    return insertResult;
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
