import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuildingType } from '../../models/building-type.enum';
import { Building } from '../../models/building.entity';
import { CityBuilding } from '../../models/city-building.entity';
import { CityProduct } from '../../models/city-product.entity';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { Product } from '../../models/product.entity';
import { CityUpdateService } from './city-update.service';

export class CityService {
  constructor(
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
    private productRepository: Repository<Product>,
    private readonly cityUpdateService: CityUpdateService,
  ) {}

  public async createBuilding(
    cityId: string,
    buildingId: string
  ): Promise<string> {
    console.log(`Creating a new building ${buildingId} in city ${cityId}`);
    const newBuilding = await this.buildingRepository.findOne({
      where: { id: buildingId },
    });
    if (!newBuilding) {
      throw new Error(
        `Cannot create Building. Reason: No building with the id ${buildingId} exists.`
      );
    }

    // update the city products before checking whether construction costs can be paid
    this.cityUpdateService.updateCity(cityId);

    // Check whether construction cost can be paid
    const products = await this.cityProductRepository.find();
    const costs: CityProduct[] = [];
    for (const constructionCost of newBuilding.constructionCosts) {
      const hasProduct = products.find(
        (product) => product.product.id === constructionCost.product.id
      );
      if (!hasProduct) {
        throw new Error(
          `Cannot create Building. Reason: Not enough materials to pay construction cost. Need: ${constructionCost.product.name}. Have: None.`
        );
      }
      const hasAmount = hasProduct.amount >= constructionCost.amount;
      if (!hasAmount) {
        throw new Error(
          `Cannot create Building. Reason: Not enough materials to pay construction cost. Need: ${constructionCost.amount} ${constructionCost.product.name}. Have: ${hasProduct.amount}.`
        );
      }
      costs.push({
        ...hasProduct,
        amount: hasProduct.amount - constructionCost.amount,
      });
    }

    // Check if all outputs of the new building already exist in the city, if not create them!
    const allCityProducts = await this.cityProductRepository.find();
    for (const output of newBuilding.outputs) {
      const cityProduct = allCityProducts.find(
        (cityProduct) => cityProduct.product.id === output.product.id
      );
      if (!cityProduct) {
        await this.cityProductRepository
          .save({
            city: { id: cityId },
            product: { id: output.product.id },
            amount: 0,
          })
          .catch((reason) => {
            throw new Error(
              `Could not create new city product for product ${output.product.id}. Reason: ${reason}`
            );
          });
      }
    }

    // prepare the new building (find employees or residents)
    const newCityBuilding: Partial<CityBuilding> = {
      building: newBuilding,
      city: { id: cityId } as City,
    };
    const freePlaces = newBuilding.places;
    if (newBuilding.buildingType === BuildingType.ACCOMMODATION) {
      const homelessHabitants = await this.habitantRepository.find({
        where: { accommodation: null },
        take: freePlaces,
      });
      newCityBuilding.residents = homelessHabitants;
      newCityBuilding.employees = [];
    }
    if (newBuilding.buildingType === BuildingType.PRODUCTION_SITE) {
      const unemployedHabitants = await this.habitantRepository.find({
        where: { employment: null },
        take: freePlaces,
      });
      newCityBuilding.employees = unemployedHabitants;
      newCityBuilding.residents = [];
    }

    // Pay the construction costs
    for (const cost of costs) {
      await this.cityProductRepository
        .update({ product: cost.product }, cost)
        .catch((reason) => {
          throw new Error(
            `Could not pay construction cost ${cost.amount} ${cost.product.name}. Reason: ${reason}`
          );
        });
    }

    // Build the building
    const saveResult = await this.cityBuildingRepository
      .save(newCityBuilding)
      .catch((reason) => {
        throw new Error(
          `Could not construct the new building ${newBuilding.name} (construction costs are lost). Reason: ${reason}`
        );
      });
    return saveResult.id;
  }

  /**
   * Create a new city with initial values for products, buildings and habitants.
   * @param name
   * @returns
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
      await this.habitantRepository.insert(habitants);
      // await this.cityBuildingRepository.insert(buildings);
      await this.cityProductRepository.insert(products);
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
