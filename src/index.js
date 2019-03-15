import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { persistCache } from 'apollo-cache-persist';
import { CachePersistor } from 'apollo-cache-persist';
import localforage from 'localforage';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
// import { withClientState } from 'apollo-link-state';
// import merge from 'lodash.merge';

import config from './config';
// import localState from './localState';

import './assets/css/semantic.min.css';
import GlobalStyle from './styles/globalStyle';

import App from './App';
import registerServiceWorker from './utils/registerServiceWorker';

const cache = new InMemoryCache();

localforage.config({
  // driver      : localforage.LOCALSTORAGE,
  name: 'tangram',
  storeName: 'cache',
  description: 'persist cache'
});
const persistor = new CachePersistor({
  cache,
  storage: localforage,
  debug: true
});

const link = new HttpLink({
  uri: config.api.graphqlUrl,
  credentials: 'same-origin'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    // withClientState(merge(localState, { cache })),
    authLink.concat(link)
  ]),
  resolvers: {}
});

const data = {
  account: {
    __typename: 'Account',
    loggedIn: false,
    user: {
      __typename: 'User',
      id: '',
      username: ''
    }
  }
};
cache.writeData({ data });

client.onResetStore(() => cache.writeData({ data }));

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restored: false
    };
  }

  componentDidMount() {
    persistor.restore().then(() => {
      this.setState({ restored: true });
    });
  }

  render() {
    let app = null;
    if (!this.state.restored) {
      app = <div>Loading!!!</div>;
    } else {
      app = (
        <ApolloProvider client={client}>
          <React.Fragment>
            <GlobalStyle />
            <Router>
              <App />
            </Router>
          </React.Fragment>
        </ApolloProvider>
      );
    }

    return app;
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));

registerServiceWorker();
