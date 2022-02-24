import { DetailCardProps } from "@economics1k/ui";

export interface BuildingMasterDetailComponentState {
  selectedBuildingId: string;
  buidingDetails?: DetailCardProps;
  spaceUsedForBuildingType: number;
}
