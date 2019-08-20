import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Input } from 'reactstrap';
/* Actions */
/* API */
import { sendResetPasswordInstructionsRequest } from 'api/users';
/* Base */
import CardLayout from 'components/base/layout/card';
import AuthLayout from 'components/base/layout/auth';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { setErrorsMessages } from 'components/helpers/messages';
/* Modules */

class SendResetPasswordInstructions extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      successMessage: '',
      messages: {}
    };
  }

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
    localStorage.setItem('LOGIN_MESSAGE', 'We have sent a recovery password to your email, please follow the instructions');
    this.props.history.push('/login');
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

function mapDispatch (dispatch) {
  return bindActionCreators({}, dispatch);
}

SendResetPasswordInstructions.propTypes = {
  history: PropTypes.object.isRequired
};

export default connect(
  null,
  mapDispatch
)(SendResetPasswordInstructions);
