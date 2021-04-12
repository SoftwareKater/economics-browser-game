import React, { useState } from 'react';
import './accommodation.scss';
import { useAccommodationsQuery } from '@economics1k/data-access';

import { InfoCard, DetailCard, DetailCardProps } from '@economics1k/ui';

interface AccommodationComponentState {
  selectedAccommodationId: string;
  accommodationDetails?: DetailCardProps;
}

export const Accommodation = () => {
  const [value, setValue] = useState<AccommodationComponentState>({
    selectedAccommodationId: '',
    accommodationDetails: {
      id: '',
      title: 'Your accommodation here!',
      image: 'assets/placeholder.png',
      alt: 'dummy',
      description: 'acc.description',
      buttonTitle: 'Build',
      buttonAction: () => {
        window.alert('building a shack');
      },
    },
  });

  const { loading, error, data } = useAccommodationsQuery();

  function updateAccommodationDetails(id: string): void {
    const acc = data?.accommodations.find(
      (accommodation) => accommodation.id === id
    );
    if (!acc) {
      return;
    }
    setValue({
      ...value,
      accommodationDetails: {
        id: acc.id,
        title: acc.name,
        image: 'assets/shack.png',
        alt: acc.name,
        description: acc.description,
        buttonTitle: 'Build',
        buttonAction: () => {
          window.alert('building a shack');
        },
      },
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error :(</p>;
  }
  return (
    <section>
      <div>
        {value.accommodationDetails?.id ? (
          <DetailCard
            key={value.accommodationDetails.id}
            {...value.accommodationDetails}
          />
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
