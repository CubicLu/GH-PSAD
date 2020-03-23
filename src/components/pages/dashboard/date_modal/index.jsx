import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Modal, ModalHeader, ModalBody, Button, Col, Row } from 'reactstrap';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import styles from './date_modal.module.sass'

const DateModal = (props) => {
  const { isOpen, toggleModal, apply } = props;
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })

  return (
    <Modal centered={true} isOpen={isOpen} toggle={toggleModal} size="md">
      <ModalHeader className="justify-content-center border-0 h2-title">Custom Date</ModalHeader>
      <ModalBody>
        <Row className="justify-content-center">
          <Col sm={12} md={9}>
            <Col className="d-flex justify-content-center align-items-center mt-3" sm={12}>
               <DateRangePicker
                  className={styles.datePicker}
                  ranges={[selectionRange]}
                  date={new Date()}
                  maxDate={moment().endOf('month').toDate()}
                  onChange={(ranges) => setSelectionRange(ranges.selection)}
                />
            </Col>
            <Col className="d-flex justify-content-center align-items-center mt-4">
              <Button color="danger" className="px-5 py-2 mx-2" onClick={toggleModal}>Cancel</Button>
              <Button color="success" className="px-5 py-2 mx-2 my-4" onClick={() => apply(moment(selectionRange.startDate).format('YYYY-M-D'), moment(selectionRange.endDate).format('YYYY-M-D'), null)}>Apply</Button>
            </Col>
          </Col>
        </Row>
      </ModalBody>

    </Modal>

  )
}


DateModal.propTypes = {
  apply: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired
}

export default DateModal;