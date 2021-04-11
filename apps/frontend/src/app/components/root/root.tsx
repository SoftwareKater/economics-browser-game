import { ReactComponent as Logo } from './logo.svg';
import star from './star.svg';

import { Route, Link } from 'react-router-dom';

import './root.scss';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { gql } from '@apollo/client';

import Accommodation from '../accommodation/accommodation';
import SideNav from '../side-nav/side-nav';
import {Header} from '@economics1k/ui';

const client = new ApolloClient({
  uri: 'http://localhost:3333/graphql', // sandbox gql server: https://48p1r2roz4.sse.codesandbox.io
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      query {
        cities {
          id
          name
          habitants {
            name
          }
        }
      }
    `,
  })
  .then((result) => console.log(result));

export const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Header />
      <div className="content">
        <SideNav />
        <div>
          <Route path="/accommodations" exact component={Accommodation} />
          <Route path="/production-site" exact component={Accommodation} />
        </div>
      </div>
    </ApolloProvider>
  );
};

export default Root;
