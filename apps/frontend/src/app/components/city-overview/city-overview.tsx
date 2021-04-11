import React from 'react';
import { Habitant, useGetMyCityQuery } from '@economics1k/data-access';

export const CityOverview = () => {
  const { loading, error, data } = useGetMyCityQuery();

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;

  /**
   * where to put these functions?
   * I think it makes sense to not make an api call for this, but maybe I also need this funciton in the backend?
   * @param city
   * @returns
   */
  function getUnemploymentRate(city: {
    habitants: { unemployed: boolean }[];
  }): number {
    const unemployedHabitants = city.habitants
      .map((habitant) => habitant.unemployed)
      .filter((value) => !!value).length;
    const unemploymentRate = unemployedHabitants / city.habitants.length;
    return unemploymentRate;
  }

  //   function getMeanProductivity(habitant: Habitant) {
  //     const starvingMultiplier = getMalusFromStarving(
  //       habitant.starving,
  //       habitant.starvingFor
  //     );
  //     const productivity =
  //       habitant.baseProductivity *
  //       habitant.accommodation.productivityMultiplicator *
  //       starvingMultiplier;
  //     return productivity;
  //   }

  function getSpaceUsage(city: {
    development: { buildingId: string; amount: number }[];
  }): number {
    // const spaceUsage = city.development
    //   .map((dev) => dev.buildingId)
    //   .reduce((a, b) => a + b);
    return 10000000 - 4684135;
  }

  return (
    <section>
      <h2>{data.getMyCity.name} - Dashboard</h2>
      <h3>Economic Data</h3>
      <table>
        <tbody>
          <tr>
            <td>Unemployment Rate</td>
            <td>{getUnemploymentRate(data.getMyCity)}</td>
          </tr>
          <tr>
            <td>Mean Productivity</td>
            <td>{getUnemploymentRate(data.getMyCity)}</td>
          </tr>
          <tr>
            <td>Homeless Rate</td>
            <td>{getUnemploymentRate(data.getMyCity)}</td>
          </tr>
          <tr>
            <td>Space Usage</td>
            <td>{getSpaceUsage({ development: [] })}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default CityOverview;
