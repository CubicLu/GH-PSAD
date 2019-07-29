import React, { useState } from 'react';
import { asField } from 'informed';
import ReactFileReader from 'react-file-reader';
import { Media, Container, Row, Col, Button } from 'reactstrap';

const ImageInput = asField(({ fieldState, fieldApi, ...props }) => {
  const { value } = fieldState;
  const { setValue } = fieldApi;
  const [filename, setFilename] = useState('Please Choose a Picture');
  const [filepath, setFilepath] = useState(value);

  return (
    <ReactFileReader
      base64
      handleFiles={(data) => {
        setValue(data.base64);
        setFilepath(URL.createObjectURL(data.fileList[0]));
        setFilename(data.fileList[0].name);
      }}>
      <Container>
        <Media>
          <Row xs={12}>
            <Col xs='12' sm='6'>
              <Media left href='#'>
                {
                  filepath &&
                  <img width='100%' src={filepath} alt='Agency' />
                }
              </Media>
            </Col>
            <Col xs='12' sm={filepath ? '6' : '12'}>
              <Media body>
                <Media heading={!!filepath}>
                  {filename}
                </Media>
                <Button color='primary'>Upload</Button>
              </Media>
            </Col>
          </Row>
        </Media>
      </Container>
    </ReactFileReader>
  );
});

export default ImageInput;
