import React from 'react';
import { Container } from 'reactstrap';

class AuthLayout extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Container fluid className="container-auth">
          {this.props.children}
        </Container>
      </React.Fragment>
    );
  }
}

export default AuthLayout
