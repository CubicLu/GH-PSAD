import React from 'react';
import { Text } from 'informed';
import { Link } from 'react-router-dom';

const TextWithLink = props => {
  const { field, link } = props;

  return (<React.Fragment>
    <Text className="form-control" field={field}/>
    <Link {...link}/>
  </React.Fragment>);
};

export default TextWithLink;
