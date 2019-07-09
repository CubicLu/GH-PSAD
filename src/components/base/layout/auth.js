import React from 'react';
import { Container } from 'reactstrap';
import Header from 'components/base/header'; 

class LayoutAuth extends React.Component {
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

export default LayoutAuth;
