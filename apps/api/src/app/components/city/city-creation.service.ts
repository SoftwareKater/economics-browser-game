import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ECONOMY_SPEED_FACTOR,
  INIT_HABITANTS_AMOUNT_PER_CITY,
  MS_IN_H,
} from '../../constants';
import { Building } from '../../models/building.entity';
import { CityBuilding } from '../../models/city-building.entity';
import { CityProduct } from '../../models/city-product.entity';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { Product } from '../../models/product.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CityUpdateJob } from './city-update-job.interface';
import { CITY_UPDATES_QUEUE_NAME, CITY_UPDATE_JOB_NAME } from './constants';

export class CityCreationService {
  constructor(
    @InjectQueue(CITY_UPDATES_QUEUE_NAME)
    private readonly cityUpdatesQueue: Queue<CityUpdateJob>,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(CityBuilding)
    private cityBuildingRepository: Repository<CityBuilding>,
    @InjectRepository(CityProduct)
    private cityProductRepository: Repository<CityProduct>,
    @InjectRepository(Habitant)
    private habitantRepository: Repository<Habitant>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  /**
   * Create a new city with initial values for products, buildings and habitants.
   * @param name
   * @returns id of the new city
   */
  public async createCity(name: string): Promise<string> {
    console.log(`Creating a new city with the name ${name}`);
    const newCity: Partial<City> = {
      name,
      lastCityUpdate: new Date(),
    };

    // Habitants of the new city
    const habitants = this.getInitialHabitants(newCity);

    // Initial development of the city
    // const buildings = await this.getInitialBuildings(newCity);

    // Initial Products of the new city
    const products = await this.getInitialProducts(newCity).catch((reason) => {
      throw new Error(
        `Could not get initial products for the city. Aborting city creation. Reason: ${reason}`
      );
    });

    let saveResult: (Partial<City> & City) | undefined = undefined;
    try {
      saveResult = await this.cityRepository.save(newCity);
      if (!saveResult) {
        throw new Error();
      }
      await this.habitantRepository.insert(habitants);
      // await this.cityBuildingRepository.insert(buildings);
      await this.cityProductRepository.insert(products);
      // add the city update with a delay of 1 round to the cityUpdates queue
      await this.cityUpdatesQueue.add(
        CITY_UPDATE_JOB_NAME,
        {
          cityId: saveResult.id,
        },
        { delay: ECONOMY_SPEED_FACTOR * MS_IN_H }
      );
      return saveResult?.id;
    } catch (err) {
      // Revert everything and log error
      this.cityProductRepository.delete({ city: newCity });
      this.cityBuildingRepository.delete({ city: newCity });
      this.habitantRepository.delete({ city: newCity });
      if (saveResult) {
        this.cityRepository.delete({ id: saveResult.id });
      }
      throw new Error(
        `Something went wrong during city creation. Aborted an reverted all operations.`
      );
    }
  }

  /**
   *
   * @returns
   */
  private async getInitialBuildings(
    newCity: Partial<City>
  ): Promise<Partial<CityBuilding>[]> {
    const well = await this.buildingRepository.findOne({
      where: { name: 'well' },
    });
    const shack = await this.buildingRepository.findOne({
      where: { name: 'shack' },
    });
    if (!shack || !well) {
      throw new Error(
        'Could not find buildings for inital development of the city. Aborting city creation.'
      );
    }
    const buildings: Partial<CityBuilding>[] = [
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
    return buildings;
  }

  private getInitialHabitants(newCity: Partial<City>): Partial<Habitant>[] {
    const habitants: Partial<Habitant>[] = [];
    let habitant: Partial<Habitant>;
    for (let i = 1; i <= INIT_HABITANTS_AMOUNT_PER_CITY; i++) {
      habitant = {
        // id: uuidv4(),
        name: `${newCity.name} Habitant ${i}`,
        accommodation: undefined,
        starving: 0,
        employment: undefined,
        city: newCity as City,
      };
      habitants.push(habitant);
    }
    return habitants;
  }

  private async getInitialProducts(
    newCity: Partial<City>
  ): Promise<Partial<CityProduct>[]> {
    const wood = await this.productRepository.findOne({
      where: { name: 'wood' },
    });
    const stone = await this.productRepository.findOne({
      where: { name: 'stone' },
    });
    const products: Partial<CityProduct>[] = [
      {
        amount: 1000,
        city: newCity as City,
        product: wood,
      },
      {
        amount: 1000,
        city: newCity as City,
        product: stone,
      },
    ];
    return products;
  }
}
