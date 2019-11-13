import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Col} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import styles from './parking_spaces.module.sass'

const circleSize = {
  width: '30px',
  height: '30px'
}

const isCSSIdValid = (id) => (
  (/^[A-Za-z]+[\w-:.]*$/).test(id)
)

const Circle = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const { slot, element, locateSlotId, clearLocateSlotId } = props
  if(locateSlotId) {
    setTimeout(() => {
        clearLocateSlotId()
    }, 1000);
  }
  const ID = `Slot${slot.name}`
  return (
    <div
      className={`${props.backgroundColor} ${locateSlotId === slot.id ? styles.pulseCircle : '' } position-absolute d-flex justify-content-center align-items-center rounded-circle`}
      id={ID}
      style={{
        top: element.y,
        left: element.x,
        width: circleSize.width,
        height: circleSize.height
      }}
    >
      <p className="text-white m-0">{slot ? slot.name : 'Error: Missing' }</p>
      {
        isCSSIdValid(ID) &&
          <Tooltip placement="top" isOpen={tooltipOpen} target={ID} toggle={toggle}>
            {slot ? slot.name : 'Error: Missing' }
          </Tooltip>
      }
    </div>
  )
}

const ParkingSlotCircle = (props) => {
  const { slot, element, shouldShowInfoBar, showCircleDrawSlowInfo, toggleConfirmationModal, editParkingSlotCircle } = props
  return (
    <React.Fragment>
      {
        shouldShowInfoBar &&  (
          <div
            className={`${styles.infoCircle} d-flex flex-row justify-content-around align-items-center position-absolute card`}
            style={{
              top: element.y + "px",
              left: element.x + 40 + "px"
            }}
          >
            <Col className="general-text-1">
              {slot ? slot.name : 'Error: Missing'}
            </Col>
            <Col className="d-flex flex-row justify-content-around align-items-center">
              <FontAwesomeIcon onClick={() => {}} icon={faInfoCircle} className="pointer mr-2"/>
              <FontAwesomeIcon onClick={() => editParkingSlotCircle(slot.id)} icon={faPencilAlt} className="pointer mr-2"/>
              <FontAwesomeIcon onClick={() => toggleConfirmationModal(slot.id)} color="red" icon={faTrash} className="pointer"/>
            </Col>
          </div>
        )
      }
      <span onClick={() => showCircleDrawSlowInfo(slot.id)}>
        <Circle {...props} />
      </span>
    </React.Fragment>
  )
}


ParkingSlotCircle.propTypes = {
  slot: PropTypes.object.isRequired,
  element: PropTypes.object.isRequired,
  locateSlotId: PropTypes.number,
  shouldShowInfoBar: PropTypes.bool.isRequired,
  showCircleDrawSlowInfo: PropTypes.func.isRequired,
  toggleConfirmationModal: PropTypes.func.isRequired,
  editParkingSlotCircle: PropTypes.func.isRequired
}

export default ParkingSlotCircle;