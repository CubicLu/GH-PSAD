import React from 'react';
import { isEmpty } from 'underscore';
import { ReactComponent as TimesIcon } from 'assets/times_icon.svg'
import { displayUnixTimestamp } from 'components/helpers';

import { Modal, ModalHeader, ModalBody, Button, Input, Label, Col, Row } from 'reactstrap';
const SessionRecordModal = (props) => {
  const { isOpen, toggleModal, currentSessionRecord } = props;

  debugger
  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="md">
      <ModalHeader toggle={() => toggleModal()} >
        Current parked vehicle:
      </ModalHeader>
      <ModalBody>
        <Row className="justify-content-center">
          {
            isEmpty(currentSessionRecord) ? (
              <Col className="text-center" sm={12} md={9}>
                  There are not session on this parking space
              </Col>
            ) : (
              <React.Fragment>
                <Col sm={12}>
                    <strong>Plate Number:</strong> {currentSessionRecord.vehicle.plate_number.toUpperCase()}
                </Col>
                <Col sm={12}>
                    <strong>Account:</strong> {currentSessionRecord.user_id ? currentSessionRecord.user_id : "NOT ACCOUNT"}
                </Col>
                <Col sm={12}>
                  <strong>Created at:</strong> {displayUnixTimestamp(currentSessionRecord.created_at)}
                </Col>
                <Col sm={12}>
                  <strong>Entered at:</strong> {displayUnixTimestamp(currentSessionRecord.entered_at)}
                </Col>
                <Col sm={12}>
                  <strong>Parked at:</strong> {displayUnixTimestamp(currentSessionRecord.parked_at)}
                </Col>
                <Col sm={12}>
                    <strong>Parking session number:</strong> {currentSessionRecord.id}
                </Col>
                <Col sm={12}>
                    <strong>Session Status:</strong> {currentSessionRecord.status.toLowerCase() === 'created' ? "UNCONFIRMED" : "CONFIRMED" }
                </Col>
                <Col sm={12}>
                    <strong>Paid Status:</strong> {currentSessionRecord.paid ? "UNPAID" : "PAID" }
                </Col>
              </React.Fragment>
            )
          }
        </Row>
      </ModalBody>

    </Modal>
  )
}

export default SessionRecordModal;