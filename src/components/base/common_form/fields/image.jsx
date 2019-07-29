import React, { useState } from 'react';
import { asField } from 'informed';
import ReactFileReader from 'react-file-reader';
import { Media } from 'reactstrap';
import Holder from 'holderjs';

const ImageInput = asField(({ fieldState, fieldApi }) => {
  const { value } = fieldState;
  const { setValue } = fieldApi;
  const [filename, setFilename] = useState();
  const [filepath, setFilepath] = useState(value);

  const handleFiles = data => {
    setValue(data.base64);
    setFilepath(URL.createObjectURL(data.fileList[0]));
    setFilename(data.fileList[0].name);
  };

  return (
    <ReactFileReader
      base64={true}
      handleFiles={handleFiles}>
      <Media>
        <Media left href="#">
          <Media object tag={() => (
            <img
              data-src="holder.js/200x200?auto=yes"
              src={filepath}
              alt={filename}
              className="img-thumbnail"
              ref={ref => Holder.run({ images: ref })}/>
          )}/>
        </Media>
      </Media>
    </ReactFileReader>
  )
});

export default ImageInput;
