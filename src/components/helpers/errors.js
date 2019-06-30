import React from 'react';
import { isEmpty } from 'underscore';
import { UncontrolledAlert } from 'reactstrap';
import { map } from 'underscore';

const fromJson = errors => {
  if (isEmpty(errors)) return;

  return map(errors, error => {
    return map(error, (message, idx) => <UncontrolledAlert key={idx} color="danger">{message}</UncontrolledAlert>);
  }).flat();
};

export { fromJson };
