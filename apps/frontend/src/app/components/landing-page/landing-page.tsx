import React, { useState } from 'react';
import Login from '../../auth/components/login/login';
import Registration from '../../auth/components/registration/registration';
import TokenStore from '../../auth/token-store';
import CreateCity from '../create-city/create-city';

export const LandingPage = () => {
  const tokenStore = new TokenStore();

  const [userToken, setUserToken] = useState(tokenStore.getToken());

  if (!userToken) {
    return (
      <div>
        <p>Welcome to Economics1k the economic simulation browser game!</p>
        <h2> Register for a new account </h2>
        <Registration />
        <h2> or Login to an existing account</h2>
        <Login />
      </div>
    );
  }
  return <CreateCity />;
};

export default LandingPage;
