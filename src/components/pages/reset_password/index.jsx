import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
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
/* Modules */

class ResetPassword extends React.Component {
  state = {
    password: '',
    passwordConfirmation: '',
    resetPasswordToken: '',
    messages: [],
    isFetching: false,
    passwordTokenInvalid: true
  }

  submitForm = (event) => {
    event.preventDefault();

    if (this.state.password === this.state.passwordConfirmation) {
      this.setState({
        isFetching: true,
      });
      return resetPasswordRequest(this.state.password, this.state.resetPasswordToken)
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

  redirectToLogin = (message) => {
    localStorage.setItem('LOGIN_MESSAGE', message);
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
          debugger
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
    const resetPasswordToken = this.props.match.params.reset_password_token
    this.setState({ resetPasswordToken })
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

function mapDispatch(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  null,
  mapDispatch
)(ResetPassword);
