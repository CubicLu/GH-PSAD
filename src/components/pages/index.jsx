import React from 'react';
import { Redirect, Route } from 'react-router';
import Login from './login';
import Dashboard from './dashboard';
import { connect } from 'react-redux';
import PrivateRoute from 'routes/private_route';
import Layout from 'components/base/layout';
import { clearToken } from 'actions/users';

class App extends React.Component {
  componentDidMount() {
    const { location, history } = this.props;

    if (location.pathname === '/') {
      history.push('/dashboard');
    }
  }

  render () {
    return (
      <React.Fragment>
        <Layout>
          <Route path='/sign_out' render={() => {
            this.props.dispatch(clearToken);
            return <Redirect to="/login"/>;
          }} />
          <PrivateRoute path="/dashboard" component={Dashboard}/>
        </Layout>
        <Route path="/login" component={Login}/>
      </React.Fragment>
    );
  }
}

export default connect()(App);
