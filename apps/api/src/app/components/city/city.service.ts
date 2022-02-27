import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuildingType } from '../../models/building-type.enum';
import { Building } from '../../models/building.entity';
import { CityBuilding } from '../../models/city-building.entity';
import { CityProduct } from '../../models/city-product.entity';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { CityUpdateService } from './city-update.service';

export class CityService {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(CityBuilding)
    private cityBuildingRepository: Repository<CityBuilding>,
    @InjectRepository(CityProduct)
    private cityProductRepository: Repository<CityProduct>,
    @InjectRepository(Habitant)
    private habitantRepository: Repository<Habitant>,
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
}
