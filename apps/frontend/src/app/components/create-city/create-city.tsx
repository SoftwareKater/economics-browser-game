import React, { useState } from 'react';
import { Form } from '@adobe/react-spectrum';
import { TextField } from '@adobe/react-spectrum';
import { Button } from '@adobe/react-spectrum';
import { useCreateCityMutation } from '@economics1k/data-access';
import { ProgressCircle } from '@adobe/react-spectrum';

export const CreateCity = () => {
  const [cityName, setCityName] = useState('');

  const [createCityMutation, { data, loading, error }] = useCreateCityMutation({
    variables: {
      name: cityName,
    },
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    createCityMutation();
  };

  if (loading) {
    return <ProgressCircle aria-label="Loading…" isIndeterminate />;
  }
  if (error) {
      return <p>Error :(</p>
  }
  if (data) {
      return <p>Sucessfully created new city with name {cityName}</p>
  }

  return (
    <Form maxWidth="size-3600" onSubmit={handleSubmit}>
      <TextField
        label="Name"
        inputMode="text"
        onChange={(name) => setCityName(name)}
      />
      <Button variant="cta" type="submit">
        Create City
      </Button>
    </Form>
  );
};

export default CreateCity;
