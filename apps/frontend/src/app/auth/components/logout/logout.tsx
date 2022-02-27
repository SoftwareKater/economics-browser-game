import React, { useState } from 'react';
import { Form } from '@adobe/react-spectrum';
import { TextField } from '@adobe/react-spectrum';
import { Button } from '@adobe/react-spectrum';
import { AuthService } from '../../auth-service';
import TokenStore from '../../token-store';

export const Logout = () => {
  const authService = new AuthService();
  const tokenStore = new TokenStore();

  const [userToken, setUserToken] = useState(tokenStore.getToken());

  function handleSubmit() {
    // authService.logout();
    tokenStore.removeToken();
    setUserToken(undefined);
  }

  if (userToken) {
    return (
      <Form maxWidth="size-3600" onSubmit={handleSubmit}>
        <Button variant="cta" type='submit'>
          Logout
        </Button>
      </Form>
    );
  }
  return <div></div>;
};

export default Logout;