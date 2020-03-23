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
  } = props
  return (
     <Modal isOpen={isOpen} onOpened={onOpened} size='lg' toggle={toggleModal} onClosed={onClosed} >
      <ModalHeader className="mx-auto border-0">{title}</ModalHeader>
      <ModalBody>
        {props.children}
      </ModalBody>
      <ModalFooter className="justify-content-center border-0">
        <Button color="danger" className="px-5 py-2 mb-4" onClick={toggleModal}>Cancel</Button>{' '}
        {
          showSaveButton && <Button color="success" className="px-5 py-2 mb-4" onClick={onClickSave}>Save&nbsp;&nbsp;</Button>
        }
      </ModalFooter>
    </Modal>
  )
}

export default Form;