import React, { useState } from 'react';
import { Form } from '@adobe/react-spectrum';
import { TextField } from '@adobe/react-spectrum';
import { Button } from '@adobe/react-spectrum';
import { useCreateUserMutation } from '@economics1k/data-access';

export const Registration = () => {
  const [createUserMutation] = useCreateUserMutation();

  const [nickName, setNickName] = useState('');
  const [cityName, setCityName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function register(
    nickName: string,
    cityName: string,
    email: string,
    password: string
  ) {
    createUserMutation({ variables: { nickName, cityName, email, password } });
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    try {
      register(nickName, cityName, email, password);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  return (
    <Form maxWidth="size-3600" onSubmit={handleSubmit}>
      <TextField
        label="Nick Name"
        inputMode="text"
        onChange={(name) => setNickName(name)}
      />
      <TextField
        label="City Name"
        inputMode="text"
        onChange={(name) => setCityName(name)}
      />
      <TextField
        label="Email"
        inputMode="email"
        onChange={(email) => setEmail(email)}
      />
      <TextField
        label="Password"
        onChange={(password) => setPassword(password)}
      />
      <Button variant="cta" type="submit">
        Register
      </Button>
    </Form>
  );
};

export default Registration;
