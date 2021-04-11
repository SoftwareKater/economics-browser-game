import { BuildingType } from '../models/building-type.entity';
import { Building } from '../models/building.entity';
import { STONE } from './products/stone';
import { WATER } from './products/water';
import { WHEAT } from './products/wheat';
import { WOOD } from './products/wood';

export const homelessProductivityMultiplicator = 0.1;
export const homelessDescription =
  'A habitant that finds no free accommodation becomes homeless';

export const BUILDINGS: Partial<Building>[] = [
  {
    name: 'wheat field',
    description: 'a wheat field',
    buildingType: {
        name: 'production-site'
    } as BuildingType,
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
    maintenanceCosts: [],
    places: 1,
    size: 10000,
  },
  {
    name: 'well',
    description: '',
    buildingType: {
        name: 'production-site'
    } as BuildingType,
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
    maintenanceCosts: [],
    places: 1,
    size: 4,
  },
  {
    name: 'quarry',
    description: '',
    buildingType: {
        name: 'production-site'
    } as BuildingType,
    inputs: [],
    outputs: [
      {
        product: STONE,
        amount: 200,
      },
    ],
    constructionCosts: [],
    constructionTime: 10,
    maintenanceCosts: [],
    places: 100,
    size: 50000,
  },
  {
    name: 'tent',
    description: 'The most basic form of housing',
    buildingType: {
        name: 'accommodation'
    } as BuildingType,
    productivityMultiplicator: 0.2,
    size: 5,
    places: 1,
    constructionTime: 0,
    constructionCosts: [],
    maintenanceCosts: [],
  },
  {
    name: 'shack',
    description: 'A simple house build from wood',
    buildingType: {
        name: 'accommodation'
    } as BuildingType,
    productivityMultiplicator: 0.3,
    size: 10,
    places: 2,
    constructionTime: 1,
    constructionCosts: [
      {
        product: WOOD,
        amount: 100,
      },
    ],
    maintenanceCosts: [
      {
        product: WOOD,
        amount: 2,
      },
    ],
  },
  {
    name: 'sky scraper',
    description: '',
    buildingType: {
        name: 'accommodation'
    } as BuildingType,
    productivityMultiplicator: 1.5,
    size: 1000,
    places: 1000,
    constructionTime: 0,
    constructionCosts: [],
    maintenanceCosts: [],
  },
  {
    name: 'villa',
    description: '',
    buildingType: {
        name: 'accommodation'
    } as BuildingType,
    productivityMultiplicator: 2,
    size: 1000,
    places: 5,
    constructionTime: 0,
    constructionCosts: [],
    maintenanceCosts: [],
  },
];
