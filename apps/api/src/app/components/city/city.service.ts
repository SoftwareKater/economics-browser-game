import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuildingOutput } from '../../models/building-output.entity';
import { BuildingType } from '../../models/building-type.enum';
import { Building } from '../../models/building.entity';
import { CityBuilding } from '../../models/city-building.entity';
import { CityProduct } from '../../models/city-product.entity';
import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { Product } from '../../models/product.entity';

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
    const newBuilding = await this.buildingRepository.findOne({
      where: { id: buildingId },
    });
    if (!newBuilding) {
      throw new Error(
        `Cannot create Building. Reason: No building with the id ${buildingId} exists.`
      );
    }
    // @todo if the building is built for the first time / if one of the output products is currently "unknown" to the city
    // there needs to be an update on the cityproducts with amount 0, to initialize the lastUpdate column.
    this.updateCityProducts(cityId);

    // Check whether construction cost can be paid
    const products = await this.cityProductRepository.find();
    console.log(products);
    const newProducts: CityProduct[] = [];
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
      newProducts.push({
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
    await this.cityProductRepository.save(newProducts);
    // Build the building
    const saveResult = await this.cityBuildingRepository.save(newCityBuilding);
    return saveResult.id;
  }

  public async createCity(name: string): Promise<string> {
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
      throw new Error(
        'Could not find buildings for inital development of the city. Aborting city creation.'
      );
    }
    const buildings: Partial<CityBuilding>[] = [
      // {
      //   building: well,
      //   city: newCity as City,
      // },
      // {
      //   building: shack,
      //   city: newCity as City,
      // },
      // {
      //   building: shack,
      //   city: newCity as City,
      // },
      // {
      //   building: shack,
      //   city: newCity as City,
      // },
    ];

    // Initial Products of the new city
    const wood = await this.productRepository.findOne({
      where: { name: 'wood' },
    });
    const stone = await this.productRepository.findOne({
      where: { name: 'stone' },
    });
    if (!wood || !stone) {
      throw new Error(
        'Could not find buildings for inital development of the city. Aborting city creation.'
      );
    }
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

    let saveResult: (Partial<City> & City) | undefined = undefined;
    try {
      saveResult = await this.cityRepository.save(newCity);
      await this.habitantRepository.insert(habitants);
      await this.cityBuildingRepository.insert(buildings);
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
   * @param cityId
   */
  public async updateCityProducts(cityId: string): Promise<void> {
    console.log(`Updating products for city with id ${cityId}`);
    const productionSites = (
      await this.cityBuildingRepository.find({
        where: {
          city: { id: cityId },
          // building: { building : {buildingType: BuildingType.PRODUCTION_SITE }},
        },
      })
    ).filter(
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
    console.log(outputs);

    for (const product of allProducts) {
      console.log('-------');
      console.log(product.name);
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
      console.log(totalOutput);
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
        const lastUpdate =
          cityProduct.lastUpdate.getTime() + 2 * 60 * 60 * 1000;
        const delta = lastUpdate
          ? (totalOutput * (now - lastUpdate)) / (60 * 60 * 1000)
          : 0;
        if (delta > 0) {
          updateProducts.push({
            city: { id: cityId } as City,
            product: product,
            amount: (cityProduct.amount ?? 0) + delta,
          } as CityProduct);
        }
      }
    }
    console.log('Updating the products', updateProducts);
    for (const updateProduct of updateProducts) {
      await this.cityProductRepository.update(
        { product: updateProduct.product },
        updateProduct
      );
    }
  }
}
