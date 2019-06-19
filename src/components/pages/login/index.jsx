import React from 'react';
import styles from './login.module.sass';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux'
import {UserActions} from "actions";
import {isEmpty} from 'underscore';
import {Spinner} from 'reactstrap';
import {Alert, Button, Input} from "reactstrap";

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

    UserActions.authFetch(this.state.username, this.state.password).then(
      res => this.handleResponse(res)
    );
  };

  showErrors = () => {
    if (isEmpty(this.state.errors)) return;

    let messages = [];

    for (const field in this.state.errors) {
      messages.push(this.state.errors[ field ].map((message, idx) => {
        return <Alert key={idx} color="danger">{message}</Alert>;
      }));
    }

    return messages;
  };

  handleResponse(res) {
    if (res.ok) {
      this.setToken(res.json());
    } else {
      this.setErrors(res.json());
    }
  }

  setToken(promise) {
    promise.then(json => {
      this.setState({
        isFetching: false,
        errors: {}
      });

      this.props.setToken(json.token);
      this.props.history.push('/dashboard');
    });
  }

  setErrors(promise) {
    promise.then(json => {
        this.setState({
          isFetching: false,
          errors: json.errors
        });
      }
    ).catch(error => {
      this.setState({
        isFetching: false,
        errors: {
          server: [ error ]
        }
      });
    })
  }

  showSpinner = () => {
    return (
      <span>
        Loading...
        <Spinner className="ml-1" size="sm" color="default"/>
      </span>
    )
  };

  componentDidMount() {
    document.body.style.background = '#007bff';
    document.body.style.background = 'linear-gradient(to right, #0062E6, #33AEFF)';
  }

  componentWillUnmount() {
    document.body.style.background = null;
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className={`card ${styles[ "card-signin" ]} my-5`}>
              <div className={styles[ "card-body" ]}>
                {this.showErrors()}
                <h5 className={`${styles[ "card-title" ]} text-center`}>Sign In</h5>
                <fieldset disabled={this.state.isFetching}>
                  <form onSubmit={this.submitForm} className={styles[ "form-signin" ]}>
                    <div className={styles[ "form-label-group" ]}>
                      <Input type="email" value={this.state.username} onChange={event => this.setState({
                        username: event.target.value
                      })} placeholder="Email address" required autoFocus />
                      <label htmlFor="inputEmail">Email address</label>
                    </div>

                    <div className={styles[ "form-label-group" ]}>
                      <Input type="password" value={this.state.password} onChange={event => this.setState({
                        password: event.target.value
                      })} placeholder="Password" required />
                      <label htmlFor="inputPassword">Password</label>
                    </div>

                    <div className="custom-control custom-checkbox mb-3">
                      <input type="checkbox" className="custom-control-input" id="customCheck1"/>
                      <label className="custom-control-label" htmlFor="customCheck1">Remember password</label>
                    </div>
                    <Button color="primary" className="text-uppercase btn-lg btn-block" type="submit">
                      {this.state.isFetching ? this.showSpinner() : "Sign In"}
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
  const { setToken } = UserActions;
  return bindActionCreators({ setToken }, dispatch);
}

export default connect(
  null,
  mapDispatch
)(Login);
