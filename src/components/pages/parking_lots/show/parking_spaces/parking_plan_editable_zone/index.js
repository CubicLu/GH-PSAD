import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'underscore';
import ParkingSlotCircle from '../parking_slot_circle'
import SlotAssignmentBar from '../slot_assignment_bar'
import {
  markSlotOnParkingPlan,
  updateCirclePointer
} from '../mouse_events'
import styles from '../parking_plans.module.sass'
import { ParkingPlanContext } from '../index'

const MouseCircle = () => {

  const parkingPlanContext = useContext(ParkingPlanContext)
  const { circleRef } = parkingPlanContext.func

  let slot, colorCircle = '';

  return (
      <div
        ref={circleRef}
        className={`position-absolute rounded-circle d-flex justify-content-center align-items-center ${styles.followCircle} ${colorCircle}`}
      >
        <p className="text-white m-0">{slot ? slot.name : '' }</p>
      </div>
  )
}

const ParkingPlanEditableZone = (props) => {

  const parkingPlanContext = useContext(ParkingPlanContext)
  const { mapRef, multiSelectContainerRef } = parkingPlanContext.func
  const { applyMarkingSlotOnParkingPlan } = parkingPlanContext.func
  const { isEditing, isInsideEditingZone, newCircleInfo, drawedSlotContainer, list, isMovingExistingSlot, slotIdClicked } = parkingPlanContext.state
  const { parkingPlanImageURL } = props
  const cursorClass = isEditing ? isMovingExistingSlot ? 'grabbing' : 'crosshair' : ''
  const showSlotAssignmentBar = !isEmpty(newCircleInfo) ? '' : 'd-none'
  return (
    <React.Fragment>
      <div
        ref={mapRef}
        className={`user-select-none map-boundaries position-relative ${styles.imageMap} ${cursorClass}`}
        onMouseMove={updateCirclePointer.bind(parkingPlanContext.func)}
        onClick={markSlotOnParkingPlan.bind(parkingPlanContext.func)}
      >
        {
          (isEditing && isInsideEditingZone) && (
            <MouseCircle />
          )
        }
        <div ref={multiSelectContainerRef} className={`${styles.CircleBarContainer} ${showSlotAssignmentBar} position-absolute`}>
              <SlotAssignmentBar
                onChange={applyMarkingSlotOnParkingPlan}
              />
        </div>
        <img src={parkingPlanImageURL} className="pointer-events-none" alt="Layout Parking Space"/>
        {
          drawedSlotContainer.map(element => {
            const slot = list.find(slot => slot.id === element.parking_slot_id)
            const colorCircle = slot ? slot.status === "free" ? 'bg-green' : 'bg-red' : 'bg-grey-dark'
            return (
              <ParkingSlotCircle
                  key={slot.id}
                  backgroundColor={colorCircle}
                  slot={slot}
                  element={element}
                  shouldShowInfoBar={isEditing && !isMovingExistingSlot && slotIdClicked === slot.id}
                />
            )
          })
        }
      </div>
    </React.Fragment>
  )
}

ParkingPlanEditableZone.propTypes = {
  parkingPlanImageURL: PropTypes.string.isRequired
}

export default ParkingPlanEditableZone;