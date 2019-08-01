import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { auth } from 'api/users';
import { setToken } from 'actions/users';
import { Link } from 'react-router-dom';
import { Button, Input } from 'reactstrap';
import { btnSpinner } from 'components/helpers';
import { setErrorsMessages } from 'components/helpers/messages';
import { handleInputChange } from 'components/helpers/handle_input_change';
import CardLayout from 'components/base/layout/card';
import AuthLayout from 'components/base/layout/auth';

class Login extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      messages: [],
      isFetching: false
    };
  }

  submitForm = (event) => {
    event.preventDefault();
    this.setState({
      isFetching: true
    });

    auth(this.state.username, this.state.password)
      .then(res => this.setToken(res.data))
      .catch(error => {
        this.setState({
          isFetching: false,
          messages: setErrorsMessages(error)
        });
      });
  };

  setToken (data) {
    this.setState({
      isFetching: false,
      messages: []
    });

    this.props.setToken(data.token);
    this.props.history.push('/dashboard');
  }

  render () {
    return (
      <AuthLayout>
        <CardLayout title="Sign In" isFetching={this.state.isFetching} messages={this.state.messages}>
          <form onSubmit={this.submitForm}>
            <div className="form-label-group">
              <Input
                id="email"
                type="email"
                value={this.state.username}
                name="username"
                onChange={handleInputChange.bind(this)}
                placeholder="Email address"
                required
                autoFocus
              />
              <label htmlFor="email">Email address</label>
            </div>

            <div className="form-label-group">
              <Input
                id="password"
                type="password"
                value={this.state.password}
                name="password"
                onChange={handleInputChange.bind(this)}
                placeholder="Password"
                required
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className="custom-control custom-checkbox mb-3">
              <input type="checkbox" className="custom-control-input" id="customCheck1"/>
              <label className="custom-control-label" htmlFor="customCheck1">Remember password</label>
            </div>
            <Link to='/forgot_password' className="mr-1 mb-2 d-block">Forgot your password?</Link>
            <Button color="primary" className="text-uppercase btn-lg btn-block" type="submit">
              {this.state.isFetching ? btnSpinner({ className: 'spinner-border' }) : 'Sign In'}
            </Button>
          </form>
        </CardLayout>
      </AuthLayout>
    );
  }
}

function mapDispatch (dispatch) {
  return bindActionCreators({ setToken }, dispatch);
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(
  null,
  mapDispatch
)(Login);
