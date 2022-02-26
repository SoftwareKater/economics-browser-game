import React, { useState } from 'react';
import './accommodation.scss';
import {
  Building,
  BuildingType,
  City,
  useAccommodationsQuery,
  useGetMyCityWithBuildingsQuery,
} from '@economics1k/data-access';
import BuildingMasterDetail from '../building-master-detail/building-master-detail';
import { ProgressCircle } from '@adobe/react-spectrum';

export const Accommodation = () => {
  const accommodationsResult = useAccommodationsQuery();
  const myCityResult = useGetMyCityWithBuildingsQuery();

  if (accommodationsResult.loading || myCityResult.loading) {
    return <ProgressCircle aria-label="Loading…" isIndeterminate />;
  }
  if (accommodationsResult.error || myCityResult.error) {
    return <p>Error :(</p>;
  }
  if (!accommodationsResult.data || !myCityResult.data) {
    return <p>No Data</p>;
  }
  return (
    <BuildingMasterDetail
      {...{
        buildings: accommodationsResult.data.accommodations as Building[],
        buildingType: BuildingType.Accommodation,
        city: myCityResult.data.getMyCityWithBuildings as City,
      }}
    />
  );
};

export default Accommodation;
