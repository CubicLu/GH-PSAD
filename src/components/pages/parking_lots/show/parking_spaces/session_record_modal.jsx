import React from 'react';
import { isEmpty } from 'underscore';
import { displayUnixTimestamp } from 'components/helpers';
import { withRouter } from 'react-router-dom';

import { Modal, ModalHeader, ModalBody, Col, Row, Button } from 'reactstrap';

const SessionRecordModal = (props) => {
  const { isOpen, toggleModal, currentSessionRecord, history } = props;

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} centered={true} size="md">
      <ModalHeader className="border-0 px-5 " toggle={() => toggleModal()} >
        <span className="general-text-1">
          Current parked vehicle:
        </span>
      </ModalHeader>
      <ModalBody className="px-5">
        <Row className="justify-content-center">
          {
            isEmpty(currentSessionRecord) ? (
              <Col className="text-center general-text-1" sm={12} md={9}>
                  <strong>There isn't an active session on this parking space</strong>
              </Col>
            ) : (
              <React.Fragment>
                <Col className="general-text-1 mb-2" sm={12}>
                    <strong>Plate Number:</strong> {currentSessionRecord.vehicle.plate_number.toUpperCase()}
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                    <strong>Account:</strong> {currentSessionRecord.user_id ? currentSessionRecord.user_id : "NOT ACCOUNT"}
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                  <strong>Created at:</strong> {displayUnixTimestamp(currentSessionRecord.created_at)}
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                  <strong>Entered at:</strong> {displayUnixTimestamp(currentSessionRecord.entered_at)}
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                  <strong>Parked at:</strong> {displayUnixTimestamp(currentSessionRecord.parked_at)}
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                    <strong>Parking session number:</strong> {currentSessionRecord.id}
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                    <strong>Session Status:</strong> {currentSessionRecord.status.toLowerCase() === 'created' ? "UNCONFIRMED" : "CONFIRMED" }
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                    <strong>Paid Status:</strong> {currentSessionRecord.paid ? "UNPAID" : "PAID" }
                </Col>
                <Col className="general-text-1 my-3 justify-content-center d-flex" sm={12}>
                  <Button  size="md" onClick={() => history.push(`parking_sessions`)} className="bg-grey-dark" >
                    ALL PARKING RECORDS
                  </Button>
                </Col>
              </React.Fragment>
            )
          }
        </Row>
      </ModalBody>

    </Modal>
  )
}

export default withRouter(SessionRecordModal);
