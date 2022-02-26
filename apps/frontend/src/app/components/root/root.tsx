import { ReactComponent as Logo } from './logo.svg';
import star from './star.svg';

import { Route, Link } from 'react-router-dom';

import './root.scss';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import Accommodation from '../accommodation/accommodation';
import SideNavMenu from '../side-nav-menu/side-nav-menu';
import {Header} from '@economics1k/ui';
import CityOverview from '../city-overview/city-overview';
import ProductionSite from '../production-site/production-site';
import Product from '../product/product';

import {defaultTheme, Provider} from '@adobe/react-spectrum';

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
          <div>
            <Route path="/city" exact component={CityOverview} />
            <Route path="/accommodations" exact component={Accommodation} />
            <Route path="/production-sites" exact component={ProductionSite} />
            <Route path="/products" exact component={Product} />
          </div>
        </div>
      </Provider>
    </ApolloProvider>
  );
};

export default Root;
