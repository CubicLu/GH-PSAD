import React from 'react';
import {Redirect, Route} from "react-router";

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

export default PrivateRoute;
