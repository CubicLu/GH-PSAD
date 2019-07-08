import React from 'react';
import styles from 'styles/body-card.module.sass';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { resetPasswordRequest } from 'api/users';
import { auth } from 'api/users';
import { Link } from 'react-router-dom';
import { Button, Input, Alert, Container, Row, Col } from 'reactstrap';
import { btnSpinner } from 'components/helpers';
import { setErrorsMessages } from 'components/helpers/messages';
import { handleInputChange } from 'components/helpers/handle_input_change';
import Card from 'components/base/layout/card';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      password_confirmation: '',
      reset_password_token: '',
      messages: [],
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
      <Card isFetching={this.state.isFetching} messages={this.state.messages}>
        <form onSubmit={this.submitForm} >

          <div className="form-label-group">
            <Input 
              id="password"
              name="password"
              type="password"
              value={this.state.password}
              onChange={handleInputChange.bind(this)}
              placeholder="Password"
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="form-label-group">
            <Input 
              id="password_confirmation" 
              name="password_confirmation"
              type="password" 
              value={this.state.password_confirmation}
              onChange={handleInputChange.bind(this)}
              placeholder="Password Confirmation"
              required
            />
            <label htmlFor="password_confirmation">Password Confirmation</label>
          </div>

          <Button color="primary" className="text-uppercase btn-lg btn-block" type="submit">
            {this.state.isFetching ? btnSpinner({ className: "spinner-border" }) : 'Reset'}
          </Button>
          <Link to='/login' className="mr-1 mt-2 d-block">I Want To Sign In</Link>              
        </form>
      </Card>
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
