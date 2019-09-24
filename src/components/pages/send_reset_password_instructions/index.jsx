import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';
/* Actions */
/* API */
import { sendResetPasswordInstructionsRequest } from 'api/users';
/* Base */
import CardLayout from 'components/base/layout/card';
import AuthLayout from 'components/base/layout/auth';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { setErrorsMessages } from 'components/helpers/messages';
/* Modules */
import RedirectIfAuthorized from 'components/modules/redirect_if_authorized';

class SendResetPasswordInstructions extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      messages: {}
    };
  }

  static contextType = AlertMessagesContext

  submitForm = (event) => {
    event.preventDefault();
    this.setState({
      isFetching: true
    });

    sendResetPasswordInstructionsRequest(this.state.username)
      .then(res => this.redirectToLogin())
      .catch(error => {
        this.setState({
          isFetching: false,
          messages: setErrorsMessages(error)
        });
      });
  };

  redirectToLogin = () => {
    this.context.addAlertMessages([
      {
        text: 'Reset link has been successfully sent to his email address',
        type: 'success'
      }
    ])
    return this.props.history.push('/login')
  }

  render () {
    return (
      <AuthLayout>
        <CardLayout title="Reset Your Password" isFetching={this.state.isFetching} messages={this.state.messages}>
          <form onSubmit={this.submitForm}>
            <div className="form-label-group">
              <Input
                type="text"
                value={this.state.username}
                name="username"
                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                placeholder="Email address"
                required
                autoFocus
              />
              <label htmlFor="inputEmail">Email address</label>
            </div>
            <Button color="primary" className="text-uppercase btn-lg btn-block" type="submit">
              {this.state.isFetching ? btnSpinner({ className: 'spinner-border' }) : 'Reset'}
            </Button>
          </form>
        </CardLayout>
      </AuthLayout>
    );
  }
}

SendResetPasswordInstructions.propTypes = {
  history: PropTypes.object.isRequired
};

export default RedirectIfAuthorized(SendResetPasswordInstructions);
