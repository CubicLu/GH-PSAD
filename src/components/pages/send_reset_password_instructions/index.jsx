import React from 'react';
import styles from 'styles/body-card.module.sass';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { sendResetPasswordInstructionsRequest } from 'api/users';
import { Button, Input, Container, Row, Col } from 'reactstrap';
import { btnSpinner } from 'components/helpers';
import { handleInputChange } from 'components/helpers/handle_input_change';
import { setErrorsMessages, setSuccessMessage } from 'components/helpers/messages';
import { Alert } from 'reactstrap';
import Card from 'components/base/layout/card';


class SendResetPasswordInstructions extends React.Component {
  constructor(props) {
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
      .then(res => this.setSuccessMessage())
      .catch(error => {
        this.setState({
          isFetching: false,
          messages: setErrorsMessages(error)
        });
      })

  };
  
  setSuccessMessage () {
    this.setState({
      isFetching: false,
      messages: setSuccessMessage('We have sent a recovery password to your email, please follow the instructions')
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
      <Card isFetching={this.state.isFetching} messages={this.state.messages}>
        <form onSubmit={this.submitForm}>
          <div className="form-label-group">
            <Input 
              type="email" 
              value={this.state.username} 
              name="username"
              onChange={handleInputChange.bind(this)} 
              placeholder="Email address" 
              required 
              autoFocus
            />
            <label htmlFor="inputEmail">Email address</label>
          </div>
          <Button color="primary" className="text-uppercase btn-lg btn-block" type="submit">
            {this.state.isFetching ? btnSpinner({ className: "spinner-border" }) : 'Reset'}
          </Button>
        </form>
      </Card>
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
