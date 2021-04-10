import { ProductionSite } from '../models/production-site.entity';
import { STONE } from './products/stone';
import { WATER } from './products/water';
import { WHEAT } from './products/wheat';

export const PRODUCTION_SITES: ProductionSite[] = [
  ({
    name: 'wheat field',
    description: 'a wheat field',
    inputs: [
      {
        product: WATER,
        amount: 1,
      },
    ],
    outputs: [
      {
        product: WHEAT,
        amount: 10,
      },
    ],
    constructionCosts: [],
    constructionTime: 1,
    maintenanceConsts: [],
    capacity: 1,
    size: 10000,
  } as unknown) as ProductionSite,
  ({
    name: 'well',
    description: '',
    inputs: [],
    outputs: [
      {
        product: WATER,
        amount: 10,
      },
    ],
    constructionCosts: [
      {
        product: STONE,
        amount: 40,
      },
    ],
    constructionTime: 2,
    maintenanceConsts: [],
    capacity: 1,
    size: 4,
  } as unknown) as ProductionSite,
  ({
    name: 'quarry',
    description: '',
    inputs: [],
    outputs: [
      {
        product: STONE,
        amount: 200,
      },
    ],
    constructionCosts: [],
    constructionTime: 10,
    maintenanceConsts: [],
    capacity: 100,
    size: 50000,
  } as unknown) as ProductionSite,
];
