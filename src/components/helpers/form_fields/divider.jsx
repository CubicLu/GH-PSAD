import React from 'react';
import { Col } from 'reactstrap';
import PropTypes from 'prop-types';

const Divider = (props) => {
  const { info } = props;
  return (
    <Col sm={12}>
      <p className='lead'>{info.title}</p>
      <hr />
    </Col>

  );
};

Divider.propTypes = {
  info: PropTypes.shape({
    title: PropTypes.string
  })
};

export default Divider;
