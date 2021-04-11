import styles from './app.module.scss';

import { ReactComponent as Logo } from './logo.svg';
import star from './star.svg';

import { Route, Link } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';


const client = new ApolloClient({
  uri: 'http://localhost:3333/graphql', // sandbox gql server: https://48p1r2roz4.sse.codesandbox.io
  cache: new InMemoryCache()
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
    `
  })
  .then(result => console.log(result));

  const App = () => (
    <ApolloProvider client={client}>
      <h1>Economics1k</h1>
    </ApolloProvider>
  );

export default App;
