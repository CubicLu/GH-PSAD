import React, { useState } from 'react';
import { asField } from 'informed';
import ReactFileReader from 'react-file-reader';
import Media from './media';
import TooltipInfo from 'components/helpers/tooltip_info';

const ImageInput = asField(({ fieldState, fieldApi, events = {}}) => {
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
    events.onChange && events.onChange()
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
        <p className="pt-1 text-center">
          <span className="general-text-3">
            Format for image:  Jpeg, Png
          </span>
          <TooltipInfo className="ml-2" text="This is the profile picture" target="picture" />
        </p>
      </React.Fragment>
    </ReactFileReader>
  );
});

export default ImageInput;
