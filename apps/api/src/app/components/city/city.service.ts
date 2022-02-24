import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuildingType } from '../../models/building-type.enum';
import { Building } from '../../models/building.entity';
import { CityBuilding } from '../../models/city-building.entity';
import { CityProduct } from '../../models/city-product.entity';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { Product } from '../../models/product.entity';

// Fixed constants
const TIME_OFFSET = 2 * 60 * 60 * 1000;
const MS_IN_H = 60 * 60 * 1000;
const MIN_PRODUCT_FRACTION = 0.01;

// Configurable constants
/**
 * Standard game speed is 1 round = 1 hour.
 * By increasing ECONOMY_SPEED_FACTOR the game progresses faster.
 * E.g. 60 -> 1 round = 1 minute
 */
const ECONOMY_SPEED_FACTOR = 1 / 60;

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
    private productRepository: Repository<Product>
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
    this.updateCity(cityId);

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
   * This method calculates the new state of the city.
   * This includes calculating the products that the city owns, whether buildings are suspended because
   * their maintenance costs cannot be paid, and whether habitants are starving and thus have a reduced productivity.
   * This has to be calculated on a per "round" (e.g per minute or per hour) basis (if you have 10 wood and two
   * buildings that require wood, then both should be running 5 rounds, instead of one running 10 rounds and the other 0).
   * @todo solve problem: if players are offline for hours, this method has to calculate 10000 rounds...
   *        This will result in the loading spinner of death on first login after long offline time.
   *        -> use redis for periodic updates?
   * @todo save lastCityUpdate time at the city object
   * @todo subtract habitants food needs
   * @todo subtract building maintenance costs
   * @todo subtract production site inputs
   * @todo take habitants productivity into account
   * @todo only allowed products can be used to pay maintenance costs and inputs
   * @param cityId
   */
  public async updateCity(cityId: string): Promise<void> {
    console.log(`Updating city with id ${cityId}`);
    const city = await this.cityRepository.findOneOrFail(cityId);
    const now = new Date().getTime();
    const lastUpdate = city.lastCityUpdate.getTime();
    const timeSinceLastUpdate = now - lastUpdate;
    const fullRoundsSinceLastUpdate = Math.floor(
      timeSinceLastUpdate / (ECONOMY_SPEED_FACTOR * MS_IN_H)
    );
    if (fullRoundsSinceLastUpdate < 1) {
      // at least one round must have passed
      console.log(
        `Will not update city. Reason: Last update is less than 1 round ago.`
      );
      return;
    }
    const newLastUpdate =
      lastUpdate + fullRoundsSinceLastUpdate * (ECONOMY_SPEED_FACTOR * MS_IN_H);

    const buildings = await this.cityBuildingRepository.find({
      where: {
        city: { id: cityId },
      },
    });
    const accommodations = buildings.filter(
      (building) =>
        building.building.buildingType === BuildingType.ACCOMMODATION
    );
    const productionSites = buildings.filter(
      (building) =>
        building.building.buildingType === BuildingType.PRODUCTION_SITE
    );
    const habitants = await this.habitantRepository.find({ where: { city } });
    const cityProducts = await this.cityProductRepository.find();
    const updateProducts: CityProduct[] = [...cityProducts];

    console.table(
      cityProducts.map((cityProduct) => ({
        name: cityProduct.product.name,
        amount: cityProduct.amount,
      }))
    );

    for (let round = 0; round < fullRoundsSinceLastUpdate; round++) {
      console.log('=================');
      console.log('Calculating round: ', round);
      // Production sites whose required inputs were available
      const workingProductionSites = [];
      // Accommodations whose maintenance costs were not paid
      const pausedAccommodations = [];

      // step #0: market transactions

      // step #1: Feed habitants if 8 rounds have passed since lastFeed
      // @todo update starving levels.
      // for (const habitant of habitants) {
      //   // get random products that have a combined nutirtion value of at least 1
      // }

      // step #2: Pay maintenance costs for buildings
      let maintenanceCostPaymentForAccommodation: {
        index: number;
        amount: number;
      }[] = [];
      for (const accommodation of accommodations) {
        const maintenanceCosts = accommodation.building.maintenanceCosts;
        for (const cost of maintenanceCosts) {
          const index = updateProducts.findIndex(
            (cityProduct) => cityProduct.product.id === cost.product.id
          );
          if (
            !updateProducts[index] ||
            updateProducts[index].amount < cost.amount
          ) {
            // maintenance costs for this building cannot be paid
            // habitants loose productivity bonus
            pausedAccommodations.push(accommodation);
            maintenanceCostPaymentForAccommodation = [];
            break;
          }
          // save the required inputs in the transactions array
          maintenanceCostPaymentForAccommodation.push({
            index,
            amount: cost.amount,
          });
        }
        if (maintenanceCostPaymentForAccommodation.length > 0) {
          // realize all saved transactions
          for (const cost of maintenanceCostPaymentForAccommodation) {
            updateProducts[cost.index].amount -= cost.amount;
          }
          maintenanceCostPaymentForAccommodation = [];
        }
      }
      console.log('---------------');
      console.log('After maintenance costs were paid: ');
      console.table(
        updateProducts.map((cityProduct) => ({
          name: cityProduct.product.name,
          amount: cityProduct.amount,
        }))
      );

      // step #3: pay inputs of production sites
      let transactions: { index: number; amount: number }[];
      let working: boolean;
      for (const productionSite of productionSites) {
        transactions = [];
        working = true;
        const requiredInputs = productionSite.building.inputs;

        // For each input, check if enough is available
        for (const input of requiredInputs) {
          const index = updateProducts.findIndex(
            (cityProduct) => cityProduct.product.id === input.product.id
          );
          if (
            !updateProducts[index] ||
            updateProducts[index].amount < input.amount
          ) {
            // required inputs are not available
            working = false;
            break;
          }
          // save the required inputs in the transactions array
          transactions.push({ index, amount: input.amount });
        }

        // remember the production site as working
        if (working) {
          workingProductionSites.push(productionSite);
        }

        // save the transactions to the updateProducts array
        if (transactions.length > 0) {
          for (const transaction of transactions) {
            updateProducts[transaction.index].amount -= transaction.amount;
          }
        }
      }
      console.log('---------------');
      console.log('After inputs for production sites were subtracted: ');
      console.table(
        updateProducts.map((cityProduct) => ({
          name: cityProduct.product.name,
          amount: cityProduct.amount,
        }))
      );

      // step #4: receive outputs of working production sites
      // @todo productivity of habitants must be regarded!
      // @todo performance refactoring: it suffices to regard one representative of every production site and multiply that with the number of working production sites of this type.
      for (const productionSite of workingProductionSites) {
        const outputs = productionSite.building.outputs;
        const productivity = 1;
        for (const output of outputs) {
          const index = updateProducts.findIndex(
            (cityProduct) => cityProduct.product.id === output.product.id
          );
          if (index < 0) {
            console.warn(
              `There is a production site that produces ${output.product.id}, but the product is not listed in city products. That should never happen - fixing...!`
            );
            const newCityProduct = {
              city: { id: cityId },
              product: output.product,
              amount: 0,
            };
            const cityProduct = await this.cityProductRepository.save(
              newCityProduct
            );
            updateProducts.push(cityProduct);
          }
          updateProducts[index].amount += productivity * output.amount;
        }
      }
      console.log('---------------');
      console.log('After outputs of production sites were added: ');
      console.table(
        updateProducts.map((cityProduct) => ({
          name: cityProduct.product.name,
          amount: cityProduct.amount,
        }))
      );
    }
    console.log('=================');
    console.table(
      updateProducts.map((cityProduct) => ({
        name: cityProduct.product.name,
        amount: cityProduct.amount,
      }))
    );

    for (const updateProduct of updateProducts) {
      await this.cityProductRepository.update(
        { product: updateProduct.product },
        updateProduct
      );
    }
    await this.cityRepository.update(
      { id: cityId },
      { lastCityUpdate: new Date(newLastUpdate) }
    );
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
