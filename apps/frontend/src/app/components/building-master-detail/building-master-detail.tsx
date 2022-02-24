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

export const BuildingMasterDetail = (props: BuildingMasterDetailProps) => {
  function getSpaceUsage(): number {
    let spaceUsedForBuildingType: number;
    const buildingsOfType = props.city.buildings.filter(
      (building) => building.building.buildingType === props.buildingType
    );
    if (!buildingsOfType || buildingsOfType.length < 1) {
      spaceUsedForBuildingType = 0;
    } else {
      spaceUsedForBuildingType =
        props.city.buildings.length > 0
          ? buildingsOfType
              .map((building) => building.building.size)
              .reduce((a, b) => a + b)
          : 0;
    }
    return spaceUsedForBuildingType;
  }

  const [value, setValue] = useState<BuildingMasterDetailComponentState>({
    selectedBuildingId: '',
    spaceUsedForBuildingType: getSpaceUsage() ?? 0,
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
        image: 'assets/shack.png',
        alt: building.name,
        description: building.description,
        buttonTitle: 'Build',
        buttonAction: () => {
          createBuildingMutation({
            variables: { cityId: props.city.id, buildingId },
          });
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
        {props.buildings.map(({ id, name }) => (
          <InfoCard
            key={id}
            {...{
              title: name,
              image: `assets/${name}`,
              alt: name,
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
