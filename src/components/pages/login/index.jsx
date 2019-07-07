import React from 'react';
import styles from './index.module.sass';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { auth } from 'api/users';
import { setToken } from 'actions/users';
import { Link } from 'react-router-dom';
import { Button, Input } from 'reactstrap';
import { btnSpinner } from 'components/helpers';
import { fromJson as showErrors } from 'components/helpers/errors';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: {},
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
      .catch(error => this.setErrors(error))
  };

  setToken(data) {
    this.setState({
      isFetching: false,
      errors: {}
    });

    this.props.setToken(data.token);
    this.props.history.push('/dashboard');
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
                <h5 className={`${styles['card-title']} text-center`}>Sign In</h5>
                <fieldset disabled={this.state.isFetching}>
                  <form onSubmit={this.submitForm} className={styles['form-signin']}>
                    <div className={styles['form-label-group']}>
                      <Input id="email" type="email" value={this.state.username} onChange={event => this.setState({
                        username: event.target.value
                      })} placeholder="Email address" required autoFocus/>
                      <label htmlFor="email">Email address</label>
                    </div>

                    <div className={styles['form-label-group']}>
                      <Input id="password" name="password" type="password" value={this.state.password}
                             onChange={event => this.setState({ password: event.target.value })}
                             placeholder="Password"
                             required/>
                      <label htmlFor="password">Password</label>
                    </div>

                    <div className="custom-control custom-checkbox mb-3">
                      <input type="checkbox" className="custom-control-input" id="customCheck1"/>
                      <label className="custom-control-label" htmlFor="customCheck1">Remember password</label>
                    </div>
                    <Link to='/send_reset_password_instrucctions' className=" mr-1 mb-2 d-block">Forgot your password?</Link>              
                    <Button color="primary" className="text-uppercase btn-lg btn-block" type="submit">
                      {this.state.isFetching ? btnSpinner({ className: styles['spinner-border'] }) : 'Sign In'}
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
  return bindActionCreators({ setToken }, dispatch);
}

export default connect(
  null,
  mapDispatch
)(Login);
