import React, { useState, useEffect } from 'react';
import ReactFileReader from 'react-file-reader';
import { Modal, ModalHeader, ModalBody, Button, Input, Label, Col, Row } from 'reactstrap';

const FileLayoutModal = (props) => {
  const { saveParkingSpaceFile, isOpen, toggleModal, defaultName, defaultURL } = props;
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState(defaultName)
  const [fileURL, setFileURL] = useState(defaultName)

  useEffect(() => {
    setFileName(defaultName)
    setFileURL(defaultURL)
  }, [defaultName, defaultURL]);

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="md">
      <ModalHeader className="justify-content-center border-0 h2-title">Add New Layout</ModalHeader>
      <ModalBody>
        <Row className="justify-content-center">
          <Col sm={12} md={9}>
            <Col>
              <Col className="pr-0" sm={12}>
                <Label className="general-text-1">
                  <span className={`mr-1 text-primary`}>*</span>
                  Layout Name
                </Label>
                <Input onChange={(e) => setFileName(e.target.value)} value={fileName} placeholder="Enter Name Here" />
              </Col>
            </Col>
            <Col className="d-flex justify-content-center align-items-end mt-3" sm={12}>
              <Col className="pr-0" sm={9}>
                  <Label className="general-text-1">
                    <span className={`mr-1 text-primary`}>*</span>
                    Layout Image
                  </Label>
                  <Input placeholder="Image URL" readOnly value={fileURL}/>
              </Col>
              <Col className="pl-1" sm={3}>
                <ReactFileReader
                  base64={true}
                  handleFiles={setFile}
                >
                  <Button>Browse</Button>
                </ReactFileReader>
              </Col>
            </Col>
            <Col className="d-flex justify-content-center align-items-center mt-4">
              <Button color="danger" className="px-5 py-2 mx-2" onClick={toggleModal}>Cancel</Button>
              <Button color="success" className="px-5 py-2 mx-2 my-4" onClick={() => {
                saveParkingSpaceFile(file, fileName);
                setFileName("");
                setFile(null)
                toggleModal();
                }}>Save</Button>
            </Col>
          </Col>
        </Row>
      </ModalBody>

    </Modal>

  )
}

export default FileLayoutModal;