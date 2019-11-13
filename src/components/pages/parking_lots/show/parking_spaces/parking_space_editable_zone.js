import React from 'react';
import PropTypes from 'prop-types';
import MultiSelect from 'react-select';
import { isEmpty } from 'underscore';
import { Button, Row } from 'reactstrap';
import ParkingSlotCircle from './parking_slot_circle'

import styles from './parking_spaces.module.sass'

const MouseCircle = (props) => {
  const { circleRef, isEditingExistingSlot, slotIdClicked, list } = props
  let slot, colorCircle = '';

  if(isEditingExistingSlot) {
    slot = list.find(slot => slot.id === slotIdClicked)
    colorCircle = slot ? slot.status === 'free' ? 'bg-green' : 'bg-red' : 'bg-grey-dark'
  }

  return (
      <div
        ref={circleRef}
        className={`position-absolute rounded-circle d-flex justify-content-center align-items-center ${styles.followCircle} ${colorCircle}`}
      >
        <p className="text-white m-0">{slot ? slot.name : '' }</p>
      </div>
  )
}

const CreationBar = (props) => {
  const { list, drawedSlotContainer, applyMarkingSlotOnParkingSpace, cancelMarkingSlotOnParkingSpace } = props

  return (
    <div className="card p-3">
      <MultiSelect
        options={list.filter(slot => {
          if(!slot.coordinate_parking_space) {
            return !drawedSlotContainer.some(drawedSlot => drawedSlot.parking_slot_id === slot.id);
          }
          return false;
        }).map( slot => ({ value: slot.id, label: slot.name}))
        }
        placeholder="Parking Slot to add"
        onChange={applyMarkingSlotOnParkingSpace}
      />
      <Row className="justify-content-center">
        <Button color="danger" onClick={cancelMarkingSlotOnParkingSpace} className="px-3 mt-2 py-2  float-left">
          Cancel
        </Button>
      </Row>
    </div>
  )
}

const ParkingSpaceEditableZone = (props) => {
  const { newCircleInfo, isEditing, locateSlotId, clearLocateSlotId, isEditingExistingSlot, drawedSlotContainer, parkingSpaceImageURL, list, slotIdClicked, isInsideEditingZone } = props;
  const { editParkingSlotCircle, toggleConfirmationModal, showCircleDrawSlowInfo, updateCirclePointer, markSlotOnParkingSpace} = props;
  const { mapRef, circleRef, multiSelectContainerRef } = props

  return (
    <React.Fragment>
      <div
        ref={mapRef}
        className={`position-relative ${styles.imageMap} ${isEditing ? 'crosshair' : ''}`}
        onMouseMove={updateCirclePointer}
        onClick={markSlotOnParkingSpace}
      >
        {
          (isEditing && isInsideEditingZone) && (
            <MouseCircle
              circleRef={circleRef}
              slotIdClicked={slotIdClicked}
              list={list}
              drawedSlotContainer={drawedSlotContainer}
              isEditingExistingSlot={isEditingExistingSlot}
            />
          )
        }
        <div ref={multiSelectContainerRef} className={`${styles.mutliselect} position-absolute`}>
          {
            !isEmpty(newCircleInfo) && (
              <CreationBar
                {...props}
              />
            )
          }
        </div>
        <img src={parkingSpaceImageURL} alt="Layout Parking Space"/>
        {
          drawedSlotContainer.map(element => {
            const slot = list.find(slot => slot.id === element.parking_slot_id)
            const colorCircle = slot ? slot.status === "free" ? 'bg-green' : 'bg-red' : 'bg-grey-dark'
            return (
              <ParkingSlotCircle
                  showCircleDrawSlowInfo={showCircleDrawSlowInfo}
                  toggleConfirmationModal={toggleConfirmationModal}
                  editParkingSlotCircle={editParkingSlotCircle}
                  backgroundColor={colorCircle}
                  clearLocateSlotId={clearLocateSlotId}
                  locateSlotId={locateSlotId}
                  slot={slot}
                  element={element}
                  shouldShowInfoBar={isEditing && slotIdClicked === slot.id}
                />
            )
          })
        }
      </div>
    </React.Fragment>
  )
}

ParkingSpaceEditableZone.propTypes = {
  circleRef: PropTypes.object.isRequired,
  mapRef: PropTypes.object.isRequired,
  newCircleInfo: PropTypes.object.isRequired,
  multiSelectContainerRef: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isEditingExistingSlot: PropTypes.bool.isRequired,
  parkingSpaceImageURL: PropTypes.string.isRequired,
  drawedSlotContainer: PropTypes.array.isRequired,
  list: PropTypes.array.isRequired,
  slotIdClicked: PropTypes.number,
  locateSlotId: PropTypes.number,
  isInsideEditingZone: PropTypes.bool.isRequired,
  applyMarkingSlotOnParkingSpace: PropTypes.func.isRequired,
  cancelMarkingSlotOnParkingSpace: PropTypes.func.isRequired,
  showCircleDrawSlowInfo: PropTypes.func.isRequired,
  editParkingSlotCircle: PropTypes.func.isRequired,
  toggleConfirmationModal: PropTypes.func.isRequired,
  markSlotOnParkingSpace: PropTypes.func.isRequired,
  updateCirclePointer: PropTypes.func.isRequired,
  clearLocateSlotId: PropTypes.func.isRequired
}

export default ParkingSpaceEditableZone;