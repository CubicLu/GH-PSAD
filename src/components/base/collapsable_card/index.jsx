import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

const CollapsableCard = props => {
  const { header, defaultState = false } = props;
  const [show, toggle] = useState(defaultState);

  return (
    <Card>
      <CardHeader onClick={() => toggle(!show)}>
        <span className="mr-1">{header}</span>
        <FontAwesomeIcon icon={show ? faAngleUp : faAngleDown}/>
      </CardHeader>
      <Collapse isOpen={show}>
        <CardBody>
          {props.children}
        </CardBody>
      </Collapse>
    </Card>
  );
};

CollapsableCard.propTypes = {
  header: PropTypes.string.isRequired,
  defaultState: PropTypes.bool
};

export default CollapsableCard;
