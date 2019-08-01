import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';

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
