import {
  BuildingType,
  useGetMyCityWithBuildingsQuery,
  useProductionSitesQuery,
} from '@economics1k/data-access';

import BuildingMasterDetail from '../building-master-detail/building-master-detail';

export const ProductionSite = () => {
  const productionSitesResult = useProductionSitesQuery();
  const myCityResult = useGetMyCityWithBuildingsQuery();

  if (productionSitesResult.loading || myCityResult.loading) {
    return <p>Loading...</p>;
  }
  if (productionSitesResult.error || myCityResult.error) {
    return <p>Error :(</p>;
  }
  return (
    <BuildingMasterDetail
      {...{
        city: myCityResult.data?.getMyCityWithBuildings,
        buildings: productionSitesResult.data?.productionSites,
        buildingType: BuildingType.ProductionSite,
      }}
    />
  );
};

export default ProductionSite;
