import React from 'react';
import './accommodation.scss';
import { useAccommodationsQuery } from '@economics1k/data-access';

import { InfoCard, DetailCard, DetailCardProps } from '@economics1k/ui';

export const Accommodation = () => {
  const { loading, error, data } = useAccommodationsQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  let accommodationDetails: DetailCardProps = {} as DetailCardProps;

  function updateAccommodationDetails(id: string): void {
    console.log('updating details ', id);
    const acc = data?.accommodations.find(
      (accommodation) => accommodation.id === id
    );
    if (!acc) {
      return;
    }
    accommodationDetails = {
      id: acc.id,
      title: acc.name,
      image: 'assets/shack.png',
      alt: acc.name,
      description: 'acc.description',
      buttonTitle: 'Build',
      buttonAction: () => {
        window.alert('building a shack');
      },
    };
    console.log(accommodationDetails);
  }

  return (
    <section>
      <div>
        {accommodationDetails.id ? (
          <DetailCard key={accommodationDetails.id} {...accommodationDetails} />
        ) : (
          <div></div>
        )}
      </div>
      <div className="master">
        {data?.accommodations.map(({ id, name }) => (
          <InfoCard
            key={id}
            {...{
              title: name,
              image: `assets/${name}`,
              alt: name,
              primaryAction: () => {
                updateAccommodationDetails(id);
              },
            }}
          ></InfoCard>
        ))}
      </div>
    </section>
  );
};

export default Accommodation;
