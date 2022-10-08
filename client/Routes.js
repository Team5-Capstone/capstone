import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';

import { me } from './store';
// import Test1 from './components/Tests/Test1';
// import Test2 from './components/Tests/Test2';
// import Test3 from './components/Tests/Test3';
// import Test4 from './components/Tests/Test4';
// import Test5 from './components/Tests/Test5';
// import Test6 from './components/Tests/Test6';
// import Test7 from './components/Tests/Test7';
// import Test8 from './components/Tests/Test8';
// import Test9 from './components/Tests/Test9';
// import Test10 from './components/Tests/Test10';
import PaginatedTests from './components/Tests';
import TestGen from './components/Tests/TestGen';

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
        {isLoggedIn ? (
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/jest' exact component={PaginatedTests} />
            <Route path='/dynamic/:promptOrderId' component={TestGen} />
            {/* <Route path='/jest2' exact component={Test2} />
            <Route path='/jest3' exact component={Test3} />
            <Route path='/jest4' exact component={Test4} />
            <Route path='/jest5' exact component={Test5} />
            <Route path='/jest6' exact component={Test6} />
            <Route path='/jest7' exact component={Test7} />
            <Route path='/jest8' exact component={Test8} />
            <Route path='/jest9' exact component={Test9} />
            <Route path='/jest10' exact component={Test10} /> */}
          </Switch>
        ) : (
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <Route path='/jest' exact component={PaginatedTests} />
          </Switch>
        )}
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
