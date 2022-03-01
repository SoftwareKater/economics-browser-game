import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import SideNavMenu from '../side-nav-menu/side-nav-menu';
import { Header } from '@economics1k/ui';

import { Content, defaultTheme, Flex, Provider } from '@adobe/react-spectrum';
import RouterContainer from '../router-container/router-container';

const client = new ApolloClient({
  uri: 'http://localhost:3333/graphql', // sandbox gql server: https://48p1r2roz4.sse.codesandbox.io
  cache: new InMemoryCache(),
});

export const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Provider theme={defaultTheme}>
        <Header />
        <Flex direction="row" gap="size-100" >
          <Content width="size-3000">
            <SideNavMenu />
          </Content>
          <Content minWidth="size-3000">
            <RouterContainer />
          </Content>
        </Flex>
      </Provider>
    </ApolloProvider>
  );
};

export default Root;
