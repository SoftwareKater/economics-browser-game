import React, { useState } from 'react';
import { useGetMyCityWithHabitantsQuery } from '@economics1k/data-access';

export const CityOverview = () => {
  const [value, setValue] = useState({ showPercent: false });

  const { loading, error, data } = useGetMyCityWithHabitantsQuery();

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;

  /**
   * where to put these functions?
   * I think it makes sense to not make an api call for this, but maybe I also need this funciton in the backend?
   * @param city
   * @returns
   */
  function getUnemploymentCount(city: {
    habitants: { employment?: any }[];
  }): number {
    const unemployedHabitants = city.habitants
      .filter((habitant) => !habitant.employment).length;
    return unemployedHabitants;
  }
  function getHomelessCount(city: {
    habitants: { accommodation?: any }[];
  }): number {
    const homelessHabitants = city.habitants
      .filter((habitant) => !habitant.accommodation).length;
    return homelessHabitants;
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

  return (
    <section>
      <h2>{data.getMyCityWithHabitants.name} - Dashboard</h2>
      <h3>Economic Data</h3>

      <button onClick={() => (setValue({showPercent: false}))}>absolute</button>
      <button onClick={() => (setValue({showPercent: true}))}>in %</button>

      <table>
        <tbody>
          <tr>
            <td>Unemployment</td>
            <td>
              {value.showPercent
                ? `${getUnemploymentCount(data.getMyCityWithHabitants) * 100 /
                  data.getMyCityWithHabitants.habitants.length}  %`
                : `${getUnemploymentCount(data.getMyCityWithHabitants)} people`}
            </td>
          </tr>
          <tr>
            <td>Homeless</td>
            <td>
              {value.showPercent
                ? `${getHomelessCount(data.getMyCityWithHabitants) * 100 /
                  data.getMyCityWithHabitants.habitants.length} %`
                : `${getHomelessCount(data.getMyCityWithHabitants)} people`}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default CityOverview;
