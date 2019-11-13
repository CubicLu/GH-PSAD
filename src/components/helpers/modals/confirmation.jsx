import React from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';

const ConfirmationModal = (props) => {

  const { text, accept, cancel, isOpen, toggleModal } = props

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="lg" >
      <ModalHeader className="justify-content-center">Confirm to proceed</ModalHeader>
      <ModalBody>
        {text}
        <div className="text-center mt-4">
          <Button onClick={cancel} className="btn btn-danger mr-1">
            No
          </Button>
          <Button onClick={accept} color="info" type="submit">
            Yes
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ConfirmationModal;