import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { v4 as uuidv4 } from 'uuid';
import { CityDevelopment } from '../../models/city-development.entity';
import { Building } from '../../models/building.entity';

@Resolver(() => City)
export class CityResolver {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(CityDevelopment)
    private cityDevelRepository: Repository<CityDevelopment>,
    @InjectRepository(Habitant)
    private habitantRepository: Repository<Habitant>
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
      relations: ['habitants', 'developments'],
    });
    if (!allCities || allCities.length < 1) {
      throw new Error('404 not found');
    }
    const myCity = allCities[0];
    // const myHabitants: Habitant[] = await this.habitantRepository.find({
    //   where: { cityId: myCity.id },
    // });
    // myCity.habitants = myHabitants;
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
    // Initial development of the city
    const developments: Partial<CityDevelopment>[] = [
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

    let insertResult: (Partial<City> & City) | undefined = undefined;
    try {
      insertResult = await this.cityRepository.save(newCity);
      await this.habitantRepository.insert(habitants);
      await this.cityDevelRepository.insert(developments);
    } catch (err) {
      // Revert everything
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
