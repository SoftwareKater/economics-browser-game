import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ECONOMY_SPEED_FACTOR, MS_IN_H } from '../../../constants';
import { BuildingType } from '../../../models/building-type.enum';
import { CityBuilding } from '../../../models/city-building.entity';
import { CityProduct } from '../../../models/city-product.entity';
import { City } from '../../../models/city.entity';
import { Habitant } from '../../../models/habitant.entity';

/**
 * This service calculates the new state of the city.
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
 */
export class CityUpdateService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(CityBuilding)
    private cityBuildingRepository: Repository<CityBuilding>,
    @InjectRepository(CityProduct)
    private cityProductRepository: Repository<CityProduct>,
    @InjectRepository(Habitant)
    private habitantRepository: Repository<Habitant>
  ) {}

  public async getTimeDelayForNextUpdateInMs(cityId: string): Promise<number> {
    const city = await this.cityRepository.findOneOrFail(cityId);
    const now = new Date().getTime();
    const lastUpdate = city.lastCityUpdate.getTime();
    const nextUpdate = lastUpdate + ECONOMY_SPEED_FACTOR * MS_IN_H;
    const timeUntilNextUpdate = nextUpdate - now;
    return timeUntilNextUpdate;
  }

  private getRoundsSinceLastUpdate(city: City): number {
    const now = new Date().getTime();
    const lastUpdate = city.lastCityUpdate.getTime();
    const timeSinceLastUpdate = now - lastUpdate;
    const fullRoundsSinceLastUpdate = Math.floor(
      timeSinceLastUpdate / (ECONOMY_SPEED_FACTOR * MS_IN_H)
    );
    return fullRoundsSinceLastUpdate;
  }

  public async updateCity(cityId: string): Promise<void> {
    console.log(`Updating city with id ${cityId}`);
    const city = await this.cityRepository.findOneOrFail(cityId);
    const fullRoundsSinceLastUpdate = this.getRoundsSinceLastUpdate(city);
    if (fullRoundsSinceLastUpdate < 1) {
      // at least one round must have passed
      console.log(
        `Will not update city. Reason: Last update is less than 1 round ago.`
      );
      return;
    }
    // @todo: should this be moved to the end of the city update method?
    // @todo: is this even correct??? or should it just be "new Date().getTime();"
    const newLastUpdate =
      city.lastCityUpdate.getTime() + fullRoundsSinceLastUpdate * (ECONOMY_SPEED_FACTOR * MS_IN_H);

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
    const cityProducts = await this.cityProductRepository.find({ where: { city } });
    const updateProducts: CityProduct[] = [...cityProducts];

    console.log('=================');
    console.log('Before city update')
    console.table(
      cityProducts.map((cityProduct) => ({
        name: cityProduct.product.name,
        amount: cityProduct.amount,
      }))
    );

    for (let round = 0; round < fullRoundsSinceLastUpdate; round++) {
      console.log('=================');
      console.log('Calculating round: ', round);
      // Accommodations whose maintenance costs were not paid
      const pausedAccommodations: CityBuilding[] = [];

      // step #0: market transactions
      // this.doMarketTransactions();

      this.feedHabitants(habitants);
      console.log('---------------');
      console.log(`After feeding ${habitants.length} habitants.`);
      console.table(
        updateProducts.map((cityProduct) => ({
          name: cityProduct.product.name,
          amount: cityProduct.amount,
        }))
      );

      this.payMaintenanceCosts(
        accommodations,
        updateProducts,
        pausedAccommodations
      );
      console.log('---------------');
      console.log('After maintenance costs were paid: ');
      console.table(
        updateProducts.map((cityProduct) => ({
          name: cityProduct.product.name,
          amount: cityProduct.amount,
        }))
      );

      // Pay inputs of production sites and remember
      // production sites whose required inputs were paid
      const workingProductionSites = this.payInputCosts(
        productionSites,
        updateProducts
      );
      console.log('---------------');
      console.log('After inputs for production sites were subtracted: ');
      console.table(
        updateProducts.map((cityProduct) => ({
          name: cityProduct.product.name,
          amount: cityProduct.amount,
        }))
      );

      // step #4: receive outputs of working production sites
      await this.receiveOutputs(workingProductionSites, updateProducts, cityId);
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
    console.log(`At the end of all rounds`)
    console.table(
      updateProducts.map((cityProduct) => ({
        name: cityProduct.product.name,
        amount: cityProduct.amount,
      }))
    );

    for (const updateProduct of updateProducts) {
      await this.cityProductRepository.update(
        { city, product: updateProduct.product },
        updateProduct
      );
    }
    await this.cityRepository.update(
      { id: cityId },
      { lastCityUpdate: new Date(newLastUpdate) }
    );
  }

  /**
   * Step #2 during city update: feed all habitants
   * @param habitants all habitants of the city
   */
  private feedHabitants(habitants: Habitant[]): void {
    // reduce stored products
    // update starving levels

    // for (const habitant of habitants) {
    //   // get random products that have a combined nutirtion value of at least 1
    // }
  }

  /**
   * Step #3 during city update: pay the maintenance costs of accommodations.
   * @param accommodations
   * @param updateProducts
   * @param pausedAccommodations
   */
  private payMaintenanceCosts(
    accommodations: CityBuilding[],
    updateProducts: CityProduct[],
    pausedAccommodations: CityBuilding[]
  ): void {
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
  }

  private payInputCosts(
    productionSites: CityBuilding[],
    updateProducts: CityProduct[]
  ): CityBuilding[] {
    let transactions: { index: number; amount: number }[];
    let working: boolean;
    const workingProductionSites = [];
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
    return workingProductionSites;
  }

  /**
   * Receive the outputs that every working production site produces.
   *
   * @todo productivity of habitants must be regarded!
   * @todo performance refactoring: it suffices to regard one representative of every production site and multiply that with the number of working production sites of this type.
   * @param workingProductionSites all production sites whose inputs were paid
   * @param updateProducts is mutated!
   * @param cityId the id of the city that is updated
   */
  private async receiveOutputs(
    workingProductionSites: CityBuilding[],
    updateProducts: CityProduct[],
    cityId: string
  ): Promise<void> {
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
  }
}
