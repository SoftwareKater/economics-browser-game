import { BuildingConstructionCost } from '../models/building-construction-cost';
import { BuildingInput } from '../models/building-input.entity';
import { BuildingMaintenanceCost } from '../models/building-maintenance-cost';
import { BuildingOutput } from '../models/building-output.entity';
import { BuildingType } from '../models/building-type.enum';
import { Building } from '../models/building.entity';
import { PRODUCTS } from './products';

export const homelessProductivityMultiplicator = 0.1;
export const homelessDescription =
  'A habitant that finds no free accommodation becomes homeless';

export const BUILDINGS: Partial<Building>[] = [
  {
    name: 'wheat field',
    description: 'a wheat field',
    buildingType: BuildingType.PRODUCTION_SITE,
    inputs: [
      {
        product: PRODUCTS.WATER,
        amount: 1,
      } as BuildingInput,
    ],
    outputs: [
      {
        product: PRODUCTS.WHEAT,
        amount: 10,
      } as BuildingOutput,
    ],
    constructionTime: 1,
    places: 1,
    size: 10000,
  },
  {
    name: 'well',
    description: '',
    buildingType: BuildingType.PRODUCTION_SITE,
    inputs: [],
    outputs: [
      {
        product: PRODUCTS.WATER,
        amount: 10,
      } as BuildingOutput,
    ],
    constructionCosts: [
      {
        product: PRODUCTS.STONE,
        amount: 40,
      } as BuildingConstructionCost,
    ],
    constructionTime: 2,
    places: 1,
    size: 4,
  },
  {
    name: 'quarry',
    description: '',
    size: 50000,
    places: 100,
    buildingType: BuildingType.PRODUCTION_SITE,
    outputs: [
      {
        product: PRODUCTS.STONE,
        amount: 200,
      } as BuildingOutput,
    ],
    constructionCosts: [
      {
        product: PRODUCTS.WOOD,
        amount: 100,
      } as BuildingConstructionCost,
    ],
    constructionTime: 10,
  },
  {
    name: 'forestry',
    description: '',
    size: 100000,
    places: 5,
    buildingType: BuildingType.PRODUCTION_SITE,
    outputs: [
      {
        product: PRODUCTS.WOOD,
        amount: 20,
      } as BuildingOutput,
    ],
    constructionTime: 1,
  },
  // {
  //   name: 'tent',
  //   description: 'The most basic form of housing',
  //   size: 5,
  //   places: 1,
  //   buildingType: BuildingType.ACCOMMODATION,
  //   productivityMultiplicator: 0.2,
  //   constructionTime: 1,
  //   constructionCosts: [],
  //   maintenanceCosts: [],
  // },
  {
    name: 'shack',
    description: 'A simple house build from wood',
    buildingType: BuildingType.ACCOMMODATION,
    productivityMultiplicator: 0.3,
    size: 10,
    places: 2,
    constructionTime: 1,
    constructionCosts: [
      {
        product: PRODUCTS.WOOD,
        amount: 100,
      } as BuildingConstructionCost,
    ],
    maintenanceCosts: [
      {
        product: PRODUCTS.WOOD,
        amount: 2,
      } as BuildingMaintenanceCost,
    ],
  },
  // {
  //   name: 'sky scraper',
  //   description: '',
  //   size: 1000,
  //   places: 1000,
  //   buildingType: BuildingType.ACCOMMODATION,
  //   productivityMultiplicator: 1.5,
  //   constructionTime: 0,
  //   constructionCosts: [],
  //   maintenanceCosts: [],
  // },
  // {
  //   name: 'villa',
  //   description: '',
  //   buildingType: BuildingType.ACCOMMODATION,
  //   productivityMultiplicator: 2,
  //   size: 1000,
  //   places: 5,
  //   constructionTime: 0,
  //   constructionCosts: [],
  //   maintenanceCosts: [],
  // },
];
