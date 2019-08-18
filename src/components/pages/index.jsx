import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router';
import Login from './login';
import SendResetPasswordInstructions from './send_reset_password_instructions';
import ResetPassword from './reset_password';
import Dashboard from './dashboard';
import { connect } from 'react-redux';
import PrivateRoute from 'routes/private_route';
import Layout from 'components/base/layout';
import { clearToken } from 'actions/users';

class App extends React.Component {
  componentDidMount () {
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
            return <Redirect to='/login' />;
          }} />
          <PrivateRoute path='/dashboard' component={Dashboard} />
        </Layout>
        <Route path='/login' component={Login} />
        <Route path='/forgot_password' component={SendResetPasswordInstructions} />
        <Route path='/reset_password/:reset_password_token' component={ResetPassword} />
      </React.Fragment>
    );
  }
}

App.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect()(App);
