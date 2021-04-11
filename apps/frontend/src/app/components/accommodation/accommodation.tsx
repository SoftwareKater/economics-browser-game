
import React from 'react';
// import styles from './accommodation.scss';
import { useAccommodationsQuery } from '@economics1k/data-access';

/* eslint-disable-next-line */
export interface SetListProps {}

export const Accommodation = (props: SetListProps) => {
  const { loading, error, data } = useAccommodationsQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <ul>
      {data?.accommodations.map(({ id, name, constructionTime }) => (
        <li key={id}>
          {id} - <strong>{name}</strong> ({constructionTime} days)
        </li>
      ))}
    </ul>
  );
};

export default Accommodation;