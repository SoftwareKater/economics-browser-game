import React, { useState } from 'react';
import { City, useGetMyCityWithHabitantsQuery } from '@economics1k/data-access';

export const CityOverview = () => {
  const [value, setValue] = useState({ showPercent: false });

  const { loading, error, data } = useGetMyCityWithHabitantsQuery();

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;

  /**
   * where to put this function?
   * @param city
   * @returns The number of unemployed habitants
   */
  function getUnemploymentCount(city: City): number {
    const unemployedHabitants = city.habitants
      .filter((habitant) => !habitant.employment).length;
    return unemployedHabitants;
  }

  /**
   * where to put this function?
   * @param city
   * @returns the number of homeless habitants
   */
  function getHomelessCount(city: City): number {
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
                ? `${getUnemploymentCount(data.getMyCityWithHabitants as City) * 100 /
                  data.getMyCityWithHabitants.habitants.length}  %`
                : `${getUnemploymentCount(data.getMyCityWithHabitants as City)} people`}
            </td>
          </tr>
          <tr>
            <td>Homeless</td>
            <td>
              {value.showPercent
                ? `${getHomelessCount(data.getMyCityWithHabitants as City) * 100 /
                  data.getMyCityWithHabitants.habitants.length} %`
                : `${getHomelessCount(data.getMyCityWithHabitants as City)} people`}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default CityOverview;
