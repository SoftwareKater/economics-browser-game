import React, { useState } from 'react';
// import './accommodation.scss';
import {
  Building,
  BuildingType,
  City,
  CityBuilding,
  useCreateBuildingMutation,
  useDeleteBuildingsMutation,
} from '@economics1k/data-access';
import { Content, Flex, Heading } from '@adobe/react-spectrum';
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

  const [createBuildingMutation] = useCreateBuildingMutation();

  const [deleteBuildingsMutation] = useDeleteBuildingsMutation();

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
            variables: { buildingId },
          });
        },
        destroyAction: () => {
          console.error('Not implemented');
        },
        destroyAllAction: () => {
          deleteBuildingsMutation({
            variables: {
              cityBuildingIds: props.city.buildings
                .filter(
                  (cityBuilding) => cityBuilding.building.id === buildingId
                )
                .map((cityBuilding) => cityBuilding.id),
            },
          });
        },
      },
    });
  }

  /**
   * @todo NO! Use concrete components for the different building types
   */
  function getPageTitle(): string {
    if (props.buildingType === BuildingType.Accommodation) {
      return 'Accommodations';
    }
    return 'Production Sites';
  }

  return (
    <Content>
      <Heading level={2}>{getPageTitle()}</Heading>
      <p>
        Space used for {getPageTitle()}:{` ${value.spaceUsedForBuildingType} `}
        m^2
      </p>
      <Content minHeight="size-6000" marginBottom="size-100">
        {value.buidingDetails?.id ? (
          <DetailCard key={value.buidingDetails.id} {...value.buidingDetails} />
        ) : (
          <Content><p></p></Content>
        )}
      </Content>
      <Flex direction="row" minWidth="size-4600" gap="size-100" wrap="wrap">
        {props.buildings.map(({ id, name, places, buildingType }) => (
          <Content key={id}>
            <InfoCard
              {...{
                title: name,
                alt: name,
                statusLightColor: buildingStatistics.getBuildingStatusLightColor(
                  id,
                  buildingType,
                  places
                ),
                status: 'status',
                amount: props.city.buildings.filter(
                  (cityBuilding) => cityBuilding.building.id === id
                ).length,
                primaryAction: () => {
                  updateBuildingDetails(id);
                },
              }}
            ></InfoCard>
          </Content>
        ))}
      </Flex>
    </Content>
  );
};

export default BuildingMasterDetail;
