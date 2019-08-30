import React, { useState } from 'react';
import { asField } from 'informed';
import ReactFileReader from 'react-file-reader';
import { Button } from 'reactstrap';
import Media from './media';

const ImageInput = asField(({ fieldState, fieldApi, events}) => {
  const { value } = fieldState;
  const { setValue } = fieldApi;

  let defaultName;

  if (value) {
    const paths = value.split(/\//);
    defaultName = paths[paths.length - 1];
  }

  const [filename, setFilename] = useState(defaultName);
  const [filepath, setFilepath] = useState(value);

  const handleFiles = data => {
    setValue(data.base64);
    setFilepath(URL.createObjectURL(data.fileList[0]));
    setFilename(data.fileList[0].name);
    events.onChangeFile()
  };
  return (
    <ReactFileReader
      base64={true}
      handleFiles={handleFiles}
    >
      <React.Fragment>
        <Media
          filepath={filepath}
          filename={filename}
        />

        <div className="text-center mt-2">
          <Button type="button" color='primary' outline className="mt-1">Upload</Button>
        </div>
      </React.Fragment>
    </ReactFileReader>
  );
});

export default ImageInput;
