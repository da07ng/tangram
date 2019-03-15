import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import DefaultLayout from './layouts/DefaultLayout';
import AccountLayout from './layouts/AccountLayout';
import WorkbenchLayout from './layouts/WorkbenchLayout';

import Home from './views/Home';
import Signup from './views/Signup';
import Signin from './views/Signin';
import Blog from './views/Blog';
import NotFound from './views/NotFound';

const query = gql`
  {
    account @client {
      loggedIn
      user {
        id
        username
      }
    }
  }
`;

class App extends Component {
  render() {
    const { data } = this.props;

    const DefaultRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props => (
          <DefaultLayout {...props} data={data}>
            <Component />
          </DefaultLayout>
        )}
      />
    );

    const AccountRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props => (
          <AccountLayout {...props} data={data}>
            <Component />
          </AccountLayout>
        )}
      />
    );

    const WorkbenchRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props => (
          <WorkbenchLayout {...props} data={data}>
            <Component />
          </WorkbenchLayout>
        )}
      />
    );

    return (
      <Switch>
        <DefaultRoute exact path="/" component={Home} />

        <AccountRoute path="/signin" component={Signin} />
        <AccountRoute path="/signup" component={Signup} />

        <WorkbenchRoute path="/blog" component={Blog} />

        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default graphql(query)(App);
