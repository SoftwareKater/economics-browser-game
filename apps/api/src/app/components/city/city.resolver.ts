import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { v4 as uuidv4 } from 'uuid';

@Resolver(() => City)
export class CityResolver {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>
  ) {}

  @Query(() => [City])
  async cities() {
    return this.cityRepository.find();
  }

  @Mutation((returns) => City)
  async createCity(@Args({ name: 'name', type: () => String }) name: string) {
    const uuid = uuidv4();
    const newCity = {
      name,
      uuid,
    };
    const habitants: Habitant[] = [];
    try {
      const insertResult = await this.cityRepository.save({
        ...newCity,
        habitants,
      });
      return insertResult;
    } catch (err) {
      console.warn(err.message);
    }
    // @todo populate the city with habitants
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
