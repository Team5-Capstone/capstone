import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';

import { me } from './store';
import DeprecatedPaginatedTests from './components/Tests/DeprecatedPaginatedTests';
import Pagination from './components/Tests/Pagination';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <div>
        <Switch>
          {!isLoggedIn && (
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/signup' component={Signup} />
            </Switch>
          )}
          <Route exact path='/' component={Home} />
          <Route exact path='/jest/:promptNum' component={Pagination} />
          <Redirect exact from='/jest' to='/jest/1' />
          <Route
            exact
            path='/deprecatedJest'
            component={DeprecatedPaginatedTests}
          />
        </Switch>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));
