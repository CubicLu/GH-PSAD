import React from 'react';
import Login from './login';
import Dashboard from './dashboard';
import {connect} from "react-redux";
import {Redirect, Route} from "react-router";
import PrivateRoute from "routes/private_route";

function App(props) {
  return (
    <div>
      <Route path="/login" component={Login}/>
      <PrivateRoute isAuthorized={props.isAuthorized} path="/dashboard" component={Dashboard}/>
      <Redirect to="/dashboard"/>
    </div>
  );
}

function mapState(state) {
  const { isAuthorized } = state.user.auth;
  return { isAuthorized };
}

export default connect(
  mapState
)(App);
