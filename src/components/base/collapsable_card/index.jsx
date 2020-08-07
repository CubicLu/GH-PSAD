import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as PlusIcon } from 'assets/plus_icon.svg';
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
      <CardHeader className={`${style.CardHeader} shadow-sm d-flex align-items-center justify-content-between`} onClick={() => toggle(!show)}>
        <span className="mr-1">{header}</span>
        <div className="d-flex">
          {onAdd && (
            <div className={`${style.addButton}`} onClick={onAddClick}>
              <PlusIcon />
            </div>
          )}
          <FontAwesomeIcon className="" size="lg" icon={show ? faAngleUp : faAngleDown} />
        </div>
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
