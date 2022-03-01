import React, { useState } from 'react';
import { Form } from '@adobe/react-spectrum';
import { TextField } from '@adobe/react-spectrum';
import { Button, Content, Text } from '@adobe/react-spectrum';
import TokenStore from '../../token-store';
import { useLoginMutation, User } from '@economics1k/data-access';
import { UserToken } from '../../user-token.interface';
import { useHistory } from 'react-router-dom';
import Logout from '../logout/logout';

export const Login = () => {
  const tokenStore = new TokenStore();

  const history = useHistory();

  const [loginMutation] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [userToken, setUserToken] = useState(tokenStore.getToken());

  async function login(): Promise<void> {
    let res;
    try {
      res = await loginMutation({ variables: { email, password } });
    } catch (err: any) {
      // silence the error
      setLoginError(true);
    }
    if (!res?.data) {
      console.error('No data');
      return;
    }

    const user = res.data.login as User;
    const token: UserToken = {
      name: user.name,
      id: user.id,
      cityId: user.city.id,
    };
    tokenStore.saveToken(token);
    setUserToken(token);
    history.push('/city')
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    login();
  }

  if (!userToken) {
    return (
      <Content>
        {loginError && <Text>Wrong Username or Password</Text>}
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
      </Content>
    );
  }
  return (
    <Content>
      <Text>
        You are logged in as {userToken.name}
      </Text>
      <Logout />
    </Content>
  );
};

export default Login;
