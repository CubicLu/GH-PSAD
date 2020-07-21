import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader, Collapse } from 'reactstrap';
import { ReactComponent as ChevronDown } from 'assets/chevron_down.svg';
import { ReactComponent as ChevronUp } from 'assets/chevron_up.svg';
import style from './card.module.sass'

const CollapsableCard = props => {
  const { header, defaultState = false } = props;
  const [show, toggle] = useState(defaultState);

  return (
    <Card className={style.Card}>
      <CardHeader className={`${style.CardHeader} shadow-sm`} onClick={() => toggle(!show)}>
        <span className="mr-1">{header}</span>
        {show
          ? <ChevronUp width="16" height="16" className="svg-white" />
          : <ChevronDown width="16" height="16" className="svg-white" />
        }
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
