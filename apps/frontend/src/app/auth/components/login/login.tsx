import React, { useState } from 'react';
import { Form } from '@adobe/react-spectrum';
import { TextField } from '@adobe/react-spectrum';
import { Button } from '@adobe/react-spectrum';
import { AuthService } from '../../auth-service';
import TokenStore from '../../token-store';
import Logout from '../logout/logout';

export const Login = () => {
  const authService = new AuthService();
  const tokenStore = new TokenStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userToken, setUserToken] = useState(tokenStore.getToken());

  function login(email: string, password: string) {
    const token = authService.login(email, password);
    tokenStore.saveToken(token);
    setUserToken(token);
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    try {
      login(email, password);
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
