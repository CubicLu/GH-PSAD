import React from 'react';
import { Text } from 'informed';
import { Link } from 'react-router-dom';

const TextWithLink = props => {
  const { field } = props;
  const { name, props: link, style } = field;

  return (<React.Fragment>
    <Text className="form-control-plaintext" style={style} field={name} readOnly/>
    <Link className="btn btn-secondary float-right" to={link.to}>{link.value}</Link>
  </React.Fragment>);
};

export default TextWithLink;
