import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

const TextArea = props => {
  const { field } = props;
  const { name } = field;

  return (
    <Input type="textarea" field={name} id={name} rows={7} />
  );
};

TextArea.propTypes = {
  field: PropTypes.object.isRequired
};

export default TextArea;
