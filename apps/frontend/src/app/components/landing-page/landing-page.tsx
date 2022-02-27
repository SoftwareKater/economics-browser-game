import React, { useState } from 'react';
import Login from '../../auth/components/login/login';
import TokenStore from '../../auth/token-store';
import CreateCity from '../create-city/create-city';

export const LandingPage = () => {
  const tokenStore = new TokenStore();

  const [userToken, setUserToken] = useState(tokenStore.getToken());

  if (!userToken) {
    return (
      <div>
        <p>Welcome to Economics1k the economic simulation browser game!</p>
        <Login />
      </div>
    );
  }
  return <CreateCity />;
};

export default LandingPage;
