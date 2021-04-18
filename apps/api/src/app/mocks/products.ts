import { Product } from '../models/product.entity';

export const STONE = {
  name: 'stone',
};

export const PRODUCTS: { [name: string]: Partial<Product> } = {
  STONE: { name: 'stone' },
  WATER: { name: 'water' },
  WHEAT: { name: 'wheat' },
  WOOD: { name: 'wood' },
  COPPER: { name: 'copper' },
  IRON: { name: 'iron' },
  COPPER_PLATES: { name: 'copper-plates' },
  COPPER_WIRE: { name: 'copper-wire' },
  MEAT: { name: 'meat' },
  LEATHER: { name: 'leather' },
  OIL: { name: 'oil' },
  CATTLE: { name: 'cattle' },
  RAW_LEATHER: { name: 'raw-leather' },
};
