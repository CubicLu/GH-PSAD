import React from 'react';
import { Col } from 'reactstrap';

const Divider = (props) => {
  const { info } = props
  return (
    <Col sm={12}>
      <p className="lead">{info.title}</p>
      <hr/>
    </Col>

  )
}

export default Divider;