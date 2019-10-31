import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router';
import Login from './login';
import SendResetPasswordInstructions from './send_reset_password_instructions';
import ResetPassword from './reset_password';
import Dashboard from './dashboard';
import PrivateRoute from 'routes/private_route';
import Layout from 'components/base/layout';
import { connect } from 'react-redux';
import { AlertMessages } from 'components/helpers/alert_messages';
import { logOut } from 'actions/users';

class App extends React.Component {
  componentDidMount () {
    const { location, history } = this.props;

    if (location.pathname === '/') {
      history.push('/dashboard');
    }
  }

  render () {
    const { serverError, serverErrorCritical } = this.props;
    if (serverError && serverErrorCritical) {
      throw new Error(serverError.message);
    }

    return (
      <React.Fragment>
        <AlertMessages>
          <Layout>
            <Route path='/sign_out' render={() => {
              RemoveData.call(this);
              return <Redirect to='/login' />;
            }} />
            <PrivateRoute path='/dashboard' component={Dashboard} />
          </Layout>
          <Route path="/login" component={Login}/>
          <Route path="/forgot_password" component={SendResetPasswordInstructions}/>
          <Route path="/reset_password/:reset_password_token" component={ResetPassword}/>
        </AlertMessages>
      </React.Fragment>
    );
  }
}

function RemoveData() {
  removeFilters()
  this.props.dispatch(logOut);
}

const removeFilters = () => {
  Object.keys(localStorage).forEach(function(key){
      if (/^FILTERS_/.test(key)) {
          localStorage.removeItem(key);
      }
  });
}

App.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  serverError: PropTypes.object,
  serverErrorCritical: PropTypes.bool
};

const mapState = state => {
  const { server } = state;
  const { error = {} } = server;
  return { serverError: error.payload, serverErrorCritical: error.critical };
};

export default connect(mapState)(App);
