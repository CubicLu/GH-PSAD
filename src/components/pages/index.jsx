import React from 'react';
import { Redirect, Route } from 'react-router';
import Login from './login';
import Dashboard from './dashboard';
import { connect } from 'react-redux';
import PrivateRoute from 'routes/private_route';
import Layout from 'components/base/layout';
import { clearToken } from 'actions/user';

class App extends React.Component {
  componentDidMount() {
    const { match, history } = this.props;

    if (match.path === '/') {
      history.push('/dashboard');
    }
  }

  render () {
    return (
      <Layout>
        <Route path="/login" component={Login}/>
        <Route path='/sign_out' render={() => {
          this.props.dispatch(clearToken);
          return <Redirect to="/login"/>
        }} />
        <PrivateRoute path="/dashboard" component={Dashboard}/>
      </Layout>
    );
  }
}

export default connect()(App);
