import { Product } from '../models/product.entity';

export const STONE = {
  name: 'stone',
};

export const PRODUCTS: { [name: string]: Partial<Product> } = {
  STONE: { name: 'stone' },
  COAL: { name: 'coal' },
  WATER: { name: 'water' },
  WHEAT: { name: 'wheat' },
  FLOUR: { name: 'flour' },
  BREAD: { name: 'bread' },
  WOOD: { name: 'wood' },
  COPPER: { name: 'copper' },
  IRON: { name: 'iron' },
  COPPER_PLATES: { name: 'copper plates' },
  IRON_PLATES: { name: 'iron plates' },
  COPPER_WIRE: { name: 'copper wire' },
  MEAT: { name: 'meat' },
  LEATHER: { name: 'leather' },
  OIL: { name: 'oil' },
  CATTLE: { name: 'cattle' },
  RAW_LEATHER: { name: 'raw leather' },
  CIRCUIT_BOARD: { name: 'circuit board'},
};
