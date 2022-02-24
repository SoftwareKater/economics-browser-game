import { City, Building, BuildingType } from "@economics1k/data-access";

export interface BuildingMasterDetailProps {
  city: City;
  buildings: Building[];
  buildingType: BuildingType;
}
