import {
  Building,
  BuildingType,
  City,
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
  if (!productionSitesResult.data || !myCityResult.data) {
    return <p>No Data</p>;
  }
  return (
    <BuildingMasterDetail
      {...{
        buildings: productionSitesResult.data?.productionSites as Building[],
        buildingType: BuildingType.ProductionSite,
        city: myCityResult.data?.getMyCityWithBuildings as City,
      }}
    />
  );
};

export default ProductionSite;
