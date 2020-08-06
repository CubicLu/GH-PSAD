import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faPlus } from '@fortawesome/free-solid-svg-icons';
import style from './card.module.sass';

const CollapsableCard = props => {
  const { className, header, defaultState = false, onAdd } = props;
  const [show, toggle] = useState(defaultState);

  const onAddClick = (e) => {
    e.stopPropagation();
    if (!show) {
      toggle(true);
    }
    onAdd();
  };

  return (
    <Card className={`${style.Card}${className ? ` ${className}` : ''}`}>
      <CardHeader className={`${style.CardHeader} shadow-sm`} onClick={() => toggle(!show)}>
        <span className="mr-1">{header}</span>
        <FontAwesomeIcon className="float-right" size="lg" icon={show ? faAngleUp : faAngleDown} />
        {onAdd && (
          <div className={`float-right ${style.addButton}`} onClick={onAddClick}>
            <FontAwesomeIcon size="md" icon={faPlus} color="gray" />
          </div>
        )}
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
  className: PropTypes.string,
  header: PropTypes.string.isRequired,
  defaultState: PropTypes.bool,
  onAdd: PropTypes.func,
  children: PropTypes.any
};

export default CollapsableCard;
