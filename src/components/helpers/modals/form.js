import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';

const Form = (props) => {
  const {
    toggleModal,
    isOpen,
    onClosed,
    title,
    showSaveButton,
    onClickSave,
    onOpened
    // handleServerError
  } = props
  return (
     <Modal isOpen={isOpen} onOpened={onOpened} size='lg' toggle={toggleModal} onClosed={onClosed} >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        {props.children}
      </ModalBody>
      <ModalFooter className="justify-content-center">
        <Button color="danger" onClick={toggleModal}>Cancel</Button>{' '}
        {
          showSaveButton && <Button color="success" onClick={onClickSave}>Save</Button>
        }
      </ModalFooter>
    </Modal>
  )
}

export default Form;