import React, { useState } from 'react';
import { City, useGetMyCityQuery, useGetMyCityWithHabitantsQuery } from '@economics1k/data-access';
import { ProgressCircle } from '@adobe/react-spectrum';
import { CityStatistics } from './city-statistics';

export const CityOverview = () => {
  const cityStatistics = new CityStatistics();

  const [value, setValue] = useState({ showPercent: false });

  const { loading, error, data } = useGetMyCityQuery();

  if (loading) return <ProgressCircle aria-label="Loading…" isIndeterminate />;
  if (error || !data) return <p>Error :(</p>;

  return (
    <section>
      <h2>{data.getMyCity.name} - Dashboard</h2>
      <h3>Economic Data</h3>

      <button onClick={() => (setValue({showPercent: false}))}>absolute</button>
      <button onClick={() => (setValue({showPercent: true}))}>in %</button>

      <table>
        <tbody>
          <tr>
            <td>Unemployment</td>
            <td>
              {value.showPercent
                ? `${cityStatistics.getUnemploymentCount(data.getMyCity as City) * 100 /
                  data.getMyCity.habitants.length}  %`
                : `${cityStatistics.getUnemploymentCount(data.getMyCity as City)} people`}
            </td>
          </tr>
          <tr>
            <td>Homeless</td>
            <td>
              {value.showPercent
                ? `${cityStatistics.getHomelessCount(data.getMyCity as City) * 100 /
                  data.getMyCity.habitants.length} %`
                : `${cityStatistics.getHomelessCount(data.getMyCity as City)} people`}
            </td>
          </tr>
          <tr>
            <td>Land Usage</td>
            <td>
              {value.showPercent
                ? `${cityStatistics.getLandUsage(data.getMyCity as City) * 100 /
                  10 ** 6} %`
                : `${cityStatistics.getLandUsage(data.getMyCity as City)} sqm`}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default CityOverview;
