import { Accommodation } from '../models/accommodation.entity';
import { WOOD } from './products/wood';

export const ACCOMMODATIONS: Accommodation[] = [
  {
    name: 'homeless',
    description: 'A habitant that finds no free accommodation becomes homeless',
    productivityMultiplicator: 0,
    size: 0,
    capacity: 1,
    constructionTime: 0,
    constructionCosts: [],
    maintenanceCosts: [],
  } as unknown as Accommodation,
  {
    name: 'tent',
    description: 'The most basic form of housing',
    productivityMultiplicator: 0.1,
    size: 5,
    capacity: 1,
    constructionTime: 0,
    constructionCosts: [],
    maintenanceCosts: [],
  } as unknown as Accommodation,
  {
    name: 'shack',
    description: 'A simple house build from wood',
    productivityMultiplicator: 0.2,
    size: 10,
    capacity: 2,
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
  } as Accommodation,
  {
    name: 'sky scaper',
    description: '',
    productivityMultiplicator: 1.5,
    size: 1000,
    capacity: 1000,
    constructionTime: 0,
    constructionCosts: [],
    maintenanceCosts: [],
  } as unknown as Accommodation,
  {
    name: 'villa',
    description: '',
    productivityMultiplicator: 2,
    size: 1000,
    capacity: 5,
    constructionTime: 0,
    constructionCosts: [],
    maintenanceCosts: [],
  } as unknown as Accommodation,
];
