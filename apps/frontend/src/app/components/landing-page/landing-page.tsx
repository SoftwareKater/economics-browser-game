import React, { useState } from 'react';
import Login from '../../auth/components/login/login';

export const LandingPage = () => {
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <div>
        <p>Welcome to Economics1k the economic simulation browser game!</p>
        <Login></Login>
      </div>
    );
  }
  return <p>Welcome back!</p>;
};

export default LandingPage;
