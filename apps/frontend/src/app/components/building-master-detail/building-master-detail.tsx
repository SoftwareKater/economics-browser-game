import React, { useState } from 'react';
// import './accommodation.scss';
import {
  Building,
  City,
  CityBuilding,
  useCreateBuildingMutation,
} from '@economics1k/data-access';

import { InfoCard, DetailCard, DetailCardProps } from '@economics1k/ui';

export interface BuildingMasterDetailProps {
  city: City;
  buildings: Building[];
}

interface BuildingMasterDetailComponentState {
  selectedBuildingId: string;
  buidingDetails?: DetailCardProps;
}

export const BuildingMasterDetail = (props: BuildingMasterDetailProps) => {
  const [value, setValue] = useState<BuildingMasterDetailComponentState>({
    selectedBuildingId: '',
    buidingDetails: {
      id: '',
      title: 'Your building here!',
      image: 'assets/placeholder.png',
      alt: 'dummy',
      description: 'acc.description',
      buttonTitle: 'Build',
      buttonAction: () => {
        window.alert('Your building is build');
      },
    },
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
              amount: props.city.developments.filter(
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
