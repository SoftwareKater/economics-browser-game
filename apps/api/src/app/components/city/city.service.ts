import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INIT_CITY_SIZE_IN_SQUARE_METER } from '../../constants';
import { BuildingConstructionCost } from '../../models/building-construction-cost.entity';
import { BuildingType } from '../../models/building-type.enum';
import { Building } from '../../models/building.entity';
import { CityBuilding } from '../../models/city-building.entity';
import { CityProduct } from '../../models/city-product.entity';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { CityUpdateService } from './city-update.service';

export class CityService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(CityBuilding)
    private cityBuildingRepository: Repository<CityBuilding>,
    @InjectRepository(CityProduct)
    private cityProductRepository: Repository<CityProduct>,
    @InjectRepository(Habitant)
    private habitantRepository: Repository<Habitant>,
    private readonly cityUpdateService: CityUpdateService
  ) {}

  public async getCity(cityId: string): Promise<City | undefined> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['habitants', 'buildings', 'products'],
    });
    if (!city) {
      console.error(`Cannot find city with id ${cityId}`);
    }
    return city;
  }

  /**
   * Destroy a building in the city. Construction Costs are not refunded.
   * @todo find a new accommodation/workpace for the habitants that lived/worked at the city buildng.
   * @param cityBuildingId
   */
  public async destroyCityBuildings(
    cityBuildingIds: string[]
  ): Promise<number> {
    const res = await this.cityBuildingRepository.delete(cityBuildingIds);
    console.log(res);
    return res.affected || 0;
  }

  /**
   * @param cityId Id of the city where the building is created
   * @param buildingId Id of the building that is created
   * @returns Id of the new city building
   */
  public async createBuilding(
    cityId: string,
    buildingId: string
  ): Promise<string> {
    console.log(`Creating a new building ${buildingId} in city ${cityId}`);
    const newBuilding = await this.buildingRepository.findOne({
      where: { id: buildingId },
    });

    // Check if a building with the given id exists at all
    if (!newBuilding) {
      throw new Error(
        `Cannot create Building. Reason: No building with the id ${buildingId} exists.`
      );
    }

    // Check if enough space is available for the new building
    const city = await this.getCity(cityId);
    if (!city) {
      throw Error(
        `Cannot create building, because there is no city with id ${cityId}`
      );
    }
    if (!this.checkSpace(newBuilding, city)) {
      throw new Error(
        `Cannot create Building. Reason: Not enough space available.`
      );
    }

    // Update the city products before checking whether construction costs can be paid
    this.cityUpdateService.updateCity(cityId);

    // Check whether construction cost can be paid
    const costs = await this.checkConstructionCosts(cityId, newBuilding);

    // Create the products that will be outputs of the new building
    if (newBuilding.buildingType === BuildingType.PRODUCTION_SITE) {
      await this.createFutureOutputProducts(newBuilding, cityId);
    }

    // Create a CityBuilding from the Building
    const cityBuilding = await this.assignEmployeesOrResidents(
      newBuilding,
      cityId
    );

    // Pay the construction costs
    for (const cost of costs) {
      await this.cityProductRepository
        .update({ city, product: cost.product }, cost)
        .catch((reason) => {
          throw new Error(
            `Could not pay construction cost ${cost.amount} ${cost.product.name}. Reason: ${reason}`
          );
        });
    }

    // Build the building
    const saveResult = await this.cityBuildingRepository
      .save(cityBuilding)
      .catch((reason) => {
        // @todo rollback construction cost payment
        throw new Error(
          `Could not construct the new building ${newBuilding.name} (construction costs are lost). Reason: ${reason}`
        );
      });

    return saveResult.id;
  }

  private async checkConstructionCosts(
    cityId: string,
    newBuilding: Building
  ): Promise<CityProduct[]> {
    const products = await this.cityProductRepository.find({
      where: { city: { id: cityId } },
    });
    const costs: CityProduct[] = [];
    for (const constructionCost of newBuilding.constructionCosts) {
      const { checkedProduct, hasAmount } = this.checkProduct(
        products,
        constructionCost
      );
      if (!checkedProduct || !hasAmount) {
        throw new Error(
          `Cannot create Building. Reason: Not enough materials to pay construction cost. Need: ${
            constructionCost.amount
          } ${constructionCost.product.name}. Have: ${
            checkedProduct ? checkedProduct.amount : 0
          }.`
        );
      }
      costs.push({
        ...checkedProduct,
        amount: checkedProduct.amount - constructionCost.amount,
      });
    }
    return costs;
  }

  private checkProduct(
    products: CityProduct[],
    constructionCost: BuildingConstructionCost
  ) {
    const checkedProduct = products.find(
      (product) => product.product.id === constructionCost.product.id
    );
    if (!checkedProduct) {
      return { checkedProduct, hasAmount: false };
    }
    const hasAmount = checkedProduct.amount >= constructionCost.amount;
    return { checkedProduct, hasAmount };
  }

  private async createFutureOutputProducts(
    newBuilding: Building,
    cityId: string
  ): Promise<void> {
    const allCityProducts = await this.cityProductRepository.find({
      where: { city: { id: cityId } },
    });
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
            console.error(
              `Could not create new city product for product ${output.product.id}. Reason: ${reason}`
            );
          });
      }
    }
  }

  /**
   * @todo there seems to be a bug in the assignment of residents/employees -> find options ?!?!!!
   *
   * @param newBuilding
   * @param cityId
   * @returns
   */
  private async assignEmployeesOrResidents(
    newBuilding: Building,
    cityId: string
  ): Promise<Partial<CityBuilding>> {
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
    return newCityBuilding;
  }

  private checkSpace(newBuilding: Building, city: City): boolean {
    let spaceUsed = 0;
    if (!city.buildings || city.buildings.length < 1) {
      spaceUsed = 0;
    } else {
      spaceUsed = city.buildings
        .map((building) => building.building.size)
        .reduce((a, b) => a + b);
    }
    const spaceNeeded = newBuilding.size;
    const spaceAvailable = INIT_CITY_SIZE_IN_SQUARE_METER - spaceUsed;
    return spaceAvailable > spaceNeeded;
  }
}
