import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { showMessages } from 'components/helpers/messages';

export default function Card({messages, isFetching, children}) {
  return (
     <Container>
        <Row>
          <Col sm={9} md={7} lg={5} className="mx-auto">
            <div className="card custom-card my-5">
              <div className="card-body">
                {showMessages(messages)}
                <h5 className="card-title text-center">Reset Your Password</h5>
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
