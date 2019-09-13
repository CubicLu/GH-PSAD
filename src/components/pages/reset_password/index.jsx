import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { Button, Input } from 'reactstrap';
/* Actions */
/* API */
import { resetPasswordRequest, checkPasswordToken } from 'api/users';
/* Base */
import CardLayout from 'components/base/layout/card';
import AuthLayout from 'components/base/layout/auth';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { setErrorsMessages } from 'components/helpers/messages';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
/* Modules */
import RedirectIfAuthorized from 'components/modules/redirect_if_authorized';

class ResetPassword extends React.Component {
  state = {
    password: '',
    passwordConfirmation: '',
    messages: [],
    isFetching: false,
    passwordTokenInvalid: true
  }

  static contextType = AlertMessagesContext

  submitForm = (event) => {
    event.preventDefault();
    const resetPasswordToken = this.props.match.params.reset_password_token
    if (this.state.password === this.state.passwordConfirmation) {
      this.setState({
        isFetching: true,
      });
      return resetPasswordRequest(this.state.password, resetPasswordToken)
        .then(res => this.redirectToLogin('Your password was successfully changed' ))
        .catch(error => {
          this.setState({
            isFetching: false,
            messages: setErrorsMessages(error)
          });
        })
    }
    this.setState({
      messages: setErrorsMessages('Your password and confirmation password do not match')
    });
  };

  redirectToLogin = (text) => {
    this.context.addAlertMessages([{
      type: 'success',
      text
    }])
    this.props.history.push('/login')
  }

  verifyToken = () => {
    const resetPasswordToken = this.props.match.params.reset_password_token
    checkPasswordToken(resetPasswordToken)
      .then(res => {
        const { validToken } = res.data
        if(validToken) {
          this.setState({ passwordTokenInvalid: false })
        } else {
          this.setState({
            messages: setErrorsMessages('This link is no longer valid')
          });
        }
      })
      .catch(err => {
          console.log(err.message)
          this.props.history.push('/login')
      })
  }

  componentDidMount() {
    this.verifyToken()
  }

  render() {

    return (
      <AuthLayout>
        <CardLayout title="Reset Your Password" isFetching={this.state.isFetching} messages={this.state.messages}>
          <form onSubmit={this.submitForm}>

            <div className="form-label-group">
              <Input
                disabled={this.state.passwordTokenInvalid}
                id="password"
                name="password"
                type="password"
                value={this.state.password}
                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                placeholder="Password"
                required
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className="form-label-group">
              <Input
                disabled={this.state.passwordTokenInvalid}
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                value={this.state.passwordConfirmation}
                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                placeholder="Password Confirmation"
                required
              />
              <label htmlFor="passwordConfirmation">Password Confirmation</label>
            </div>

            <Button disabled={this.state.passwordTokenInvalid} color="primary" className="text-uppercase btn-lg btn-block" type="submit">
              {this.state.isFetching ? btnSpinner({ className: 'spinner-border' }) : 'Reset'}
            </Button>
            <Link to='/login' className="mr-1 mt-2 d-block">I Want To Sign In</Link>
          </form>
        </CardLayout>
      </AuthLayout>
    );
  }
}

ResetPassword.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default RedirectIfAuthorized(ResetPassword);
