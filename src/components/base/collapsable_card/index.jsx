import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

const CollapsableCard = props => {
  const { header, body, defaultState = false } = props;
  const [show, toggle] = useState(defaultState);

  return (
    <Card>
      <CardHeader onClick={() => toggle(!show)}>
        <span className="mr-1">{header}</span>
        <FontAwesomeIcon icon={show ? faAngleUp : faAngleDown}/>
      </CardHeader>
      <Collapse isOpen={show}>
        <CardBody>
          {body}
        </CardBody>
      </Collapse>
    </Card>
  );
};

export default CollapsableCard;
