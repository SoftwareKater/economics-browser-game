import './root.scss';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import SideNavMenu from '../side-nav-menu/side-nav-menu';
import { Header } from '@economics1k/ui';

import { defaultTheme, Provider } from '@adobe/react-spectrum';
import RouterContainer from '../router-container/router-container';
import Logout from '../../auth/components/logout/logout';

const client = new ApolloClient({
  uri: 'http://localhost:3333/graphql', // sandbox gql server: https://48p1r2roz4.sse.codesandbox.io
  cache: new InMemoryCache(),
});

export const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Provider theme={defaultTheme}>
        <Header />
        <div className="content">
          <SideNavMenu />
          <RouterContainer />
        </div>
        <Logout />
      </Provider>
    </ApolloProvider>
  );
};

export default Root;
