import React, { useState } from 'react';
import { Form } from '@adobe/react-spectrum';
import { TextField } from '@adobe/react-spectrum';
import { Button } from '@adobe/react-spectrum';
import { AuthService } from '../../auth-service';
import TokenStore from '../../token-store';
import { useGetUserByEmailQuery } from '@economics1k/data-access';
import { UserToken } from '../../user-token.interface';

export const Login = () => {
  const tokenStore = new TokenStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userToken, setUserToken] = useState(tokenStore.getToken());

  const { loading, error, data } = useGetUserByEmailQuery({
    variables: { email },
  });

  /**
   * @todo getUserByEmail query is constantly fired when typing in the email field. how to do this correct?
   * @returns
   */
  function login(): void {
    if (error) {
      console.error(error);
      return;
    }
    if (!data) {
      return;
    }
    const res = data?.getUserByEmail;
    const token: UserToken = {
      name: res.name,
      id: res.id,
      cityId: res.city.id,
    };
    tokenStore.saveToken(token);
    setUserToken(token);
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    try {
      login();
    } catch (err: any) {
      console.error(err.message);
    }
  }

  if (!userToken) {
    return (
      <Form maxWidth="size-3600" onSubmit={handleSubmit}>
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
          Login
        </Button>
      </Form>
    );
  }
  return (
    <p>
      You are logged in as {userToken.name}
      @todo redirect to /home and force refresh
    </p>
  );
};

export default Login;
