import React from 'react';
import styles from './reset_password.module.sass';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { resetPasswordRequest } from 'api/users';
import { auth } from 'api/users';
import { Link } from 'react-router-dom';
import { Button, Input, Alert } from 'reactstrap';
import { btnSpinner } from 'components/helpers';
import { fromJson as showErrors } from 'components/helpers/errors';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      password_confirmation: '',
      reset_password_token: '',
      passwordsMatch: true,
      errors: {},
      isFetching: false
    };
  }

  submitForm = (event) => {
    event.preventDefault();

    if(this.state.password == this.state.password_confirmation) {
      this.setState({
        isFetching: true,
      });
      return resetPasswordRequest(this.state.password, this.state.reset_password_token)
        .then(res => this.props.history.push('/login'))
        .catch(error => this.setErrors(error))
    }
    this.setState({
      passwordsMatch: false,
    });
  };
  
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
    this.setState({
      reset_password_token: this.props.match.params.reset_password_token
    })
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
                {!this.state.passwordsMatch &&
                  <Alert color="danger">
                    Your password and confirmation password do not match
                  </Alert>
                }
                <h5 className={`${styles['card-title']} text-center`}>Set Your New Password</h5>
                <fieldset disabled={this.state.isFetching}>
                  <form onSubmit={this.submitForm} className={styles['form-signin']}>

                    <div className={styles['form-label-group']}>
                      <Input id="password" name="password" type="password" value={this.state.password}
                             onChange={event => this.setState({ password: event.target.value })}
                             placeholder="Password"
                             required/>
                      <label htmlFor="password">Password</label>
                    </div>

                    <div className={styles['form-label-group']}>
                      <Input id="password_confirmation" name="password_confirmation" type="password" value={this.state.password_confirmation}
                             onChange={event => this.setState({ password_confirmation: event.target.value })}
                             placeholder="Confirmation Password"
                             required/>
                      <label htmlFor="password_confirmation">Password Confirmation</label>
                    </div>

                    <Button color="primary" className="text-uppercase btn-lg btn-block" type="submit">
                      {this.state.isFetching ? btnSpinner({ className: styles['spinner-border'] }) : 'Reset'}
                    </Button>
                    <Link to='/login' className="mr-1 mt-2 d-block">I Want To Sign In</Link>              
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
  return bindActionCreators({ }, dispatch);
}

export default connect(
  null,
  mapDispatch
)(ResetPassword);
