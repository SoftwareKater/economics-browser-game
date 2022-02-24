import { registerEnumType } from '@nestjs/graphql';

export enum BuildingType {
  ACCOMMODATION = "Accommodation",
  PRODUCTION_SITE ="ProductionSite",
  STORAGE = "Storage",
  UTILITY = "Utility",
}

registerEnumType(BuildingType, {
  name: 'BuildingType',
  description: 'The type of buildings',
});