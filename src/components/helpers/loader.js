import React from 'react';
import { Row, Col, Spinner } from 'reactstrap';

const Loader = () => (
  <Row className="justify-content-center align-items-center">
    <Col sm={12} className="text-center">Loading...</Col>
    <Spinner size="lg" color="primary"/>
  </Row>
)

export default Loader;