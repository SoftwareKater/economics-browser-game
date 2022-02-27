import React, { useState } from 'react';
// import './accommodation.scss';
import {
  Building,
  BuildingType,
  City,
  CityBuilding,
  useCreateBuildingMutation,
} from '@economics1k/data-access';

import { InfoCard, DetailCard } from '@economics1k/ui';
import { BuildingMasterDetailProps } from './building-master-detail-component-props.interface';
import { BuildingMasterDetailComponentState } from './building-master-detail-component-state.interface';
import { BuildingStatistics } from './building-statistics';

export const BuildingMasterDetail = (props: BuildingMasterDetailProps) => {
  const buildingStatistics = new BuildingStatistics(props);

  const [value, setValue] = useState<BuildingMasterDetailComponentState>({
    selectedBuildingId: '',
    spaceUsedForBuildingType: buildingStatistics.getSpaceUsage() ?? 0,
  });

  const [
    createBuildingMutation,
    { data, loading, error },
  ] = useCreateBuildingMutation();

  function updateBuildingDetails(buildingId: string): void {
    const building = props.buildings.find(
      (building) => building.id === buildingId
    );
    if (!building) {
      return;
    }
    setValue({
      ...value,
      buidingDetails: {
        id: building.id,
        title: building.name,
        image: `assets/img/${building.name
          .trim()
          .toLowerCase()
          .replace(' ', '_')}.png`,
        alt: building.name,
        buildingType: building.buildingType,
        amount: buildingStatistics.getBuildingAmount(building.id),
        constructionCosts: building.constructionCosts?.map((cost) => ({
          productName: cost.product.name,
          amount: cost.amount,
        })),
        maintenanceCosts: building.maintenanceCosts?.map((cost) => ({
          productName: cost.product.name,
          amount: cost.amount,
        })),
        places: building.places,
        size: building.size,
        description: building.description,
        buildAction: () => {
          createBuildingMutation({
            variables: { cityId: props.city.id, buildingId },
          });
        },
        destroyAction: () => {
          console.log('destory one building');
        },
        destroyAllAction: () => {
          console.log('destory all buildings');
        },
      },
    });
  }

  return (
    <section>
      <h2>
        {props.buildingType === BuildingType.Accommodation
          ? 'Accommodations'
          : 'Production Sites'}
      </h2>
      <p>
        Space used for Accommodations:
        {` ${value.spaceUsedForBuildingType} `}
        m^2
      </p>
      <div>
        {value.buidingDetails?.id ? (
          <DetailCard key={value.buidingDetails.id} {...value.buidingDetails} />
        ) : (
          <div></div>
        )}
      </div>
      <div className="master">
        {props.buildings.map(({ id, name, places, buildingType }) => (
          <InfoCard
            key={id}
            {...{
              title: name,
              alt: name,
              status: buildingStatistics.getBuildingStatus(
                id,
                buildingType,
                places
              ),
              amount: props.city.buildings.filter(
                (cityBuilding) => cityBuilding.building.id === id
              ).length,
              primaryAction: () => {
                updateBuildingDetails(id);
              },
            }}
          ></InfoCard>
        ))}
      </div>
    </section>
  );
};

export default BuildingMasterDetail;
