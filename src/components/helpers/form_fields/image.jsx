import React, { useState } from 'react';
import { asField } from 'informed';
import ReactFileReader from 'react-file-reader';
import { Button, Media } from 'reactstrap';
import Holder from 'holderjs';

const ImageInput = asField(({ fieldState, fieldApi }) => {
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
  };
  return (
    <ReactFileReader
      base64={true}
      handleFiles={handleFiles}
    >
      <React.Fragment>
        <Media className="justify-content-center">
          <Media left href="#">
            <Media object tag={() => (
              <img
                data-src={filepath ? filepath : "holder.js/200x200?auto=yes"}
                src={filepath}
                alt={filename}
                className="img-thumbnail"
                ref={ref => Holder.run({ images: ref })}/>
            )}/>
          </Media>
        </Media>
        <div className="text-center mt-2">
          <Button type="button" color='primary' outline className="mt-1">Upload</Button>
        </div>
      </React.Fragment>
    </ReactFileReader>
  )
});

export default ImageInput;
