import { Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BUILDINGS } from '../../mocks/buildings';
import { PRODUCTS } from '../../mocks/products';
import { BuildingConstructionCost } from '../../models/building-construction-cost.entity';
import { BuildingInput } from '../../models/building-input.entity';
import { BuildingMaintenanceCost } from '../../models/building-maintenance-cost.entity';
import { BuildingOutput } from '../../models/building-output.entity';
import { BuildingType } from '../../models/building-type.enum';
import { Building } from '../../models/building.entity';
import { Product } from '../../models/product.entity';

@Resolver(() => Building)
export class BuildingResolver {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(BuildingConstructionCost)
    private constructionCostRepository: Repository<BuildingConstructionCost>,
    @InjectRepository(BuildingInput)
    private buildingInputRepository: Repository<BuildingInput>,
    @InjectRepository(BuildingMaintenanceCost)
    private maintenanceCostRepository: Repository<BuildingMaintenanceCost>,
    @InjectRepository(BuildingOutput)
    private buildingOutputRepository: Repository<BuildingOutput>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {
    this.initMockBuildings();
  }

  @Query(() => [Building])
  async accommodations() {
    return this.buildingRepository.find({
      where: { buildingType: BuildingType.ACCOMMODATION }, relations: ['maintenanceCosts']
    });
  }

  @Query(() => [Building])
  async productionSites() {
    return this.buildingRepository.find({
      where: { buildingType: BuildingType.PRODUCTION_SITE }, relations: ['inputs', 'outputs']
    });
  }

  async initMockBuildings(): Promise<void> {
    let products: Product[] = [];
    try {
      products = await this.initMockProducts();
    } catch (err) {
      if (err.message.startsWith('Duplicate entry')) {
        products = await this.productRepository.find();
      }
    }
    if (products.length < 1) {
      return console.error('No products');
    }

    for (const building of BUILDINGS) {
      try {
        const res = await this.buildingRepository.save(building);

        if (building.constructionCosts) {
          const buildingConstructionCosts = building.constructionCosts.map(
            (constructionCost) => {
              return {
                ...constructionCost,
                building: res,
                product: products.find(
                  (product) => product.name === constructionCost.product.name
                ),
              };
            }
          );
          await this.constructionCostRepository.insert(
            buildingConstructionCosts
          );
        }

        if (building.maintenanceCosts) {
          const buildingMaintenanceCosts = building.maintenanceCosts.map(
            (maintenanceCost) => {
              return {
                ...maintenanceCost,
                building: res,
                product: products.find(
                  (product) => product.name === maintenanceCost.product.name
                ),
              };
            }
          );
          await this.maintenanceCostRepository.insert(buildingMaintenanceCosts);
        }
        if (building.inputs) {
          const buildingInputs = building.inputs.map((input) => {
            return {
              ...input,
              building: res,
              product: products.find(
                (product) => product.name === input.product.name
              ),
            };
          });
          await this.buildingInputRepository.insert(buildingInputs);
        }
        if (building.outputs) {
          const buildingOutputs = building.outputs.map((output) => {
            return {
              ...output,
              building: res,
              product: products.find(
                (product) => product.name === output.product.name
              ),
            };
          });
          await this.buildingOutputRepository.insert(buildingOutputs);
        }
      } catch (err) {
        const errMsg: string = err.message;
        if (errMsg.startsWith('Duplicate entry')) {
          // console.warn(`Building ${building.name} already exists.`)
        } else {
          // Revert all inserts
          console.error(
            `Could not save mock building "${building.name}". Reason: `,
            errMsg
          );
        }
      }
    }
  }

  private async initMockProducts(): Promise<
    (Partial<Product> & Product)[]
  > {
    const allProducts = Object.values(PRODUCTS);
    const res = await this.productRepository.save(allProducts);
    return res;
  }
}
