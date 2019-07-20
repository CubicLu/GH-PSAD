import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { showMessages } from 'components/helpers/messages';

 function CardLayout({messages, isFetching, children, title}) {
  return (
     <Container>
        <Row>
          <Col sm={9} md={7} lg={5} className="mx-auto">
            <div className="card custom-card my-5">
              <div className="card-body">
                {showMessages(messages)}
                <h5 className="card-title text-center">{title}</h5>
                <fieldset disabled={isFetching}>
                  {children}
                </fieldset>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
  );
}

export default CardLayout