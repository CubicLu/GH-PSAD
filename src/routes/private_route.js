import React from 'react';
import {Redirect, Route} from "react-router";
import { connect } from 'react-redux';

function PrivateRoute({ component: Component, isAuthorized, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthorized ? (<Component {...props} />) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

function mapState(state) {
  const { isAuthorized } = state.user.auth;
  return { isAuthorized };
}

export default connect(
  mapState
)(PrivateRoute);
