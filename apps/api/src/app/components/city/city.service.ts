import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuildingType } from '../../models/building-type.enum';
import { Building } from '../../models/building.entity';
import { CityBuilding } from '../../models/city-building.entity';
import { CityProduct } from '../../models/city-product.entity';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { Product } from '../../models/product.entity';

const TIME_OFFSET = 2 * 60 * 60 * 1000;
const MS_IN_H = 60 * 60 * 1000;
const MIN_PRODUCT_FRACTION = 0.01;

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

    // Check if all outputs of the new building already exist in the city.
    // In any case: Update the row, so that lastUpdate is initialized/reset.
    // (otherwise on next update of products the city would produce to much)
    const allCityProducts = await this.cityProductRepository.find();
    for (const output of newBuilding.outputs) {
      const cityProduct = allCityProducts.find(
        (cityProduct) => cityProduct.product.id === output.product.id
      );
      if (!cityProduct) {
        // if not existing: create!
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
      } else {
        // if exsists: bump lastUpdate column
        await this.cityProductRepository
          .update({ product: output.product }, cityProduct)
          .catch((reason) => {
            console.warn(
              `Could not update city product for product ${output.product.id} (next products update on city will product wrong numbers). Reason: ${reason}`
            );
          });
      }
    }

    // update the city products before checking whether construction costs can be paid
    this.updateCityProducts(cityId);

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
   * For all products: add the produced amount since the last update to the products of the city
   * @todo subtract habitants food needs
   * @param cityId
   */
  public async updateCityProducts(cityId: string): Promise<void> {
    console.log(`Updating products for city with id ${cityId}`);
    const productionSites = (
      await this.cityBuildingRepository.find({
        where: {
          city: { id: cityId },
        },
      })
    ).filter(
      // @todo would be better to run this filter directly on the db
      (building) =>
        building.building.buildingType === BuildingType.PRODUCTION_SITE
    );
    if (!productionSites || productionSites.length < 1) {
      console.log('City has no production sites, so no products are produced');
      return;
    }

    const allProducts = await this.productRepository.find();
    const cityProducts = await this.cityProductRepository.find();
    const updateProducts: CityProduct[] = [];
    const now = new Date().getTime();
    const outputs = productionSites.map(
      (productionSite) => productionSite.building.outputs
    );

    for (const product of allProducts) {
      const productionSiteOutputAmountsOfProduct = outputs
        .filter((productionSiteOutputs) =>
          productionSiteOutputs
            .map((output) => output.product.id)
            .includes(product.id)
        )
        .map(
          (productionSiteOutputs) =>
            productionSiteOutputs.filter(
              (output) => output.product.id === product.id
            )[0].amount
        );

      const totalOutput =
        productionSiteOutputAmountsOfProduct.length > 0
          ? productionSiteOutputAmountsOfProduct.reduce((a, b) => a + b)
          : 0;
      let cityProduct: CityProduct | undefined;
      if (totalOutput > 0) {
        cityProduct = cityProducts.find(
          (cityProduct) => cityProduct.product.id === product.id
        );
        if (!cityProduct) {
          console.warn(
            `There is a production site that produces ${product.id}, but the product is not listed in city products. That should never happen - fixing...!`
          );
          const newCityProduct = { city: { id: cityId }, product, amount: 0 };
          cityProduct = await this.cityProductRepository.save(newCityProduct);
        }
        // @todo time offset +2h should not be hard coded
        const lastUpdate = cityProduct.lastUpdate.getTime() + TIME_OFFSET;
        const delta = lastUpdate
          ? (totalOutput * (now - lastUpdate)) / MS_IN_H
          : 0;
        if (delta > MIN_PRODUCT_FRACTION) {
          updateProducts.push({
            city: { id: cityId } as City,
            product: product,
            amount: (cityProduct.amount ?? 0) + delta,
          } as CityProduct);
        }
      }
    }
    for (const updateProduct of updateProducts) {
      await this.cityProductRepository.update(
        { product: updateProduct.product },
        updateProduct
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
