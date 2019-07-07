import React from 'react';
import styles from './send_reset_password_instructions.module.sass';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { sendResetPasswordInstructionsRequest } from 'api/users';
import { Button, Input } from 'reactstrap';
import { btnSpinner } from 'components/helpers';
import { fromJson as showErrors } from 'components/helpers/errors';
import { Alert } from 'reactstrap';


class SendResetPasswordInstructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      successMessage: '', 
      errors: {}
    };
  }

  submitForm = (event) => {
    event.preventDefault();
    this.setState({
      isFetching: true
    });

    sendResetPasswordInstructionsRequest(this.state.username)
      .then(res => this.setSuccessMessage())
      .catch(error => this.setErrors(error))

  };
  
  setSuccessMessage () {
    this.setState({
      successMessage: 'We have sent a recovery password to your email, please follow the instructions',
      isFetching: false,
      errors: {}
    });
  }

  setErrors(error) {
     let errors;

    if (error.response) {
      errors = error.response.data.errors;
    } else {
      errors = { server: ['Unexpected error'] }
    }

    this.setState({
      isFetching: false,
      errors: errors
    });
  }

  componentDidMount() {
    document.body.classList.add(styles.body);
  }

  componentWillUnmount() {
    document.body.classList.remove(styles.body);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className={`card ${styles['card-signin']} my-5`}>
              <div className={styles['card-body']}>
                {showErrors(this.state.errors)}
                {this.state.successMessage &&
                  <Alert color="success">
                    {this.state.successMessage}
                  </Alert>
                }
                <h5 className={`${styles['card-title']} text-center`}>Reset Your Password</h5>
                <fieldset disabled={this.state.isFetching}>
                  <form onSubmit={this.submitForm} className={styles['form-signin']}>
                    <div className={styles['form-label-group']}>
                      <Input type="email" value={this.state.username} onChange={event => this.setState({
                        username: event.target.value
                      })} placeholder="Email address" required autoFocus/>
                      <label htmlFor="inputEmail">Email address</label>
                    </div>
                    <Button color="primary" className="text-uppercase btn-lg btn-block" type="submit">
                      {this.state.isFetching ? btnSpinner({ className: styles['spinner-border'] }) : 'Reset'}
                    </Button>
                  </form>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  null,
  mapDispatch
)(SendResetPasswordInstructions);
