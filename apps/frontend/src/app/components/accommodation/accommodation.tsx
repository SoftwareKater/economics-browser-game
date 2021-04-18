import React, { useState } from 'react';
import './accommodation.scss';
import { useAccommodationsQuery, useGetMyCityQuery } from '@economics1k/data-access';
import BuildingMasterDetail from '../building-master-detail/building-master-detail';

export const Accommodation = () => {
  const productionSitesResult = useAccommodationsQuery();
  const myCityResult = useGetMyCityQuery();

  if (productionSitesResult.loading || myCityResult.loading) {
    return <p>Loading...</p>;
  }
  if (productionSitesResult.error || myCityResult.error) {
    return <p>Error :(</p>;
  }
  return (
    <BuildingMasterDetail
      {...{ buildings: productionSitesResult.data?.accommodations, cityBuildings: myCityResult.data?.getMyCity.developments }}
    />
  );
};

export default Accommodation;
