import React, { useState } from 'react';
import './accommodation.scss';
import {
  BuildingType,
  useAccommodationsQuery,
  useGetMyCityWithBuildingsQuery,
} from '@economics1k/data-access';
import BuildingMasterDetail from '../building-master-detail/building-master-detail';

export const Accommodation = () => {
  const accommodationsResult = useAccommodationsQuery();
  const myCityResult = useGetMyCityWithBuildingsQuery();

  if (accommodationsResult.loading || myCityResult.loading) {
    return <p>Loading...</p>;
  }
  if (accommodationsResult.error || myCityResult.error) {
    return <p>Error :(</p>;
  }
  return (
    <BuildingMasterDetail
      {...{
        buildings: accommodationsResult.data?.accommodations,
        city: myCityResult.data?.getMyCityWithBuildings,
        buildingType: BuildingType.Accommodation,
      }}
    />
  );
};

export default Accommodation;
