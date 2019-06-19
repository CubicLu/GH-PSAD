import React from 'react';
import { isEmpty } from 'underscore';
import { UncontrolledAlert } from 'reactstrap';
import { map } from 'underscore';

const fromJson = errors => {
  if (isEmpty(errors)) return;

  return map(errors, (error, idx) => {
    return <UncontrolledAlert key={idx} color="danger">{error}</UncontrolledAlert>;
  });
};

export { fromJson };
