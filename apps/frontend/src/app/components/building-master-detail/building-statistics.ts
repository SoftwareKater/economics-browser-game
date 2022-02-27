import { BuildingType } from '@economics1k/data-access';
import { BuildingStatus } from '@economics1k/ui';
import { BuildingMasterDetailProps } from './building-master-detail-component-props.interface';

export class BuildingStatistics {
  constructor(private readonly props: BuildingMasterDetailProps) {}

  public getSpaceUsage(): number {
    let spaceUsedForBuildingType: number;
    const buildingsOfType = this.props.city.buildings.filter(
      (building) => building.building.buildingType === this.props.buildingType
    );
    if (!buildingsOfType || buildingsOfType.length < 1) {
      spaceUsedForBuildingType = 0;
    } else {
      spaceUsedForBuildingType =
        this.props.city.buildings.length > 0
          ? buildingsOfType
              .map((building) => building.building.size)
              .reduce((a, b) => a + b)
          : 0;
    }
    return spaceUsedForBuildingType;
  }

  public getBuildingStatus(
    buildingId: string,
    buildingType: BuildingType,
    places: number
  ): BuildingStatus {
    const allBuildings = this.props.city.buildings.filter(
      (cityBuilding) => cityBuilding.building.id === buildingId
    );
    if (!allBuildings || allBuildings.length < 1) {
      return 'negative';
    }
    if (buildingType === BuildingType.Accommodation) {
      return 'positive';
    }
    if (buildingType === BuildingType.ProductionSite) {
      if (
        allBuildings.every((building) => building.employees?.length === places)
      ) {
        return 'positive';
      }
      if (
        allBuildings.some((building) => building.employees?.length === places)
      ) {
        return 'yellow';
      }
      return 'negative';
    }
    return 'negative';
  }
}
