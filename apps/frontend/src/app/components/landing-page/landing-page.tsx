import React, { useState } from 'react';
import Login from '../../auth/components/login/login';
import Registration from '../../auth/components/registration/registration';

export const LandingPage = () => {
  return (
    <div>
      <p>Welcome to Economics1k the economic simulation browser game!</p>
      <h2> Register </h2>
      <Registration />
      <h2> Login </h2>
      <Login />
    </div>
  );
};

export default LandingPage;
