import React from 'react';
import PropTypes from 'prop-types';
import { asField } from 'informed';
import Holder from 'holderjs';
import ReactFileReader from 'react-file-reader';
import { ReactComponent as CloseIcon } from 'assets/close_icon.svg';
import AlertErrors from 'components/base/errors/alert_errors';

import styles from './multiple_files.module.sass';

class MultipleFiles extends React.Component {
  constructor (props) {
    super(props);
    this.readerRef = React.createRef();
    this.state = {
      error: ''
    };
  };

  handleFiles = data => {
    const { error } = this.state;
    const { events, fieldApi, fieldState, maxFileNumber, maxFileSize } = this.props;
    const { value = {} } = fieldState;
    const { setValue } = fieldApi;
    const { base64 = [], fileList = [] } = value;
    let sizeError = false;
    let numberError = false;
    const maxFileSizeInBytes = 1024 * 1024 * maxFileSize;
    data.base64.forEach((item, i) => {
      const file = data.fileList[i];
      const errorSize = file.size > maxFileSizeInBytes;
      const errorNumber = base64.length >= maxFileNumber;
      sizeError = sizeError || errorSize;
      numberError = numberError || errorNumber;
      if (!errorSize && !errorNumber) {
        base64.push(item);
        fileList.push(file);
      }
    });
    const errorMessages = [];
    if (sizeError) {
      errorMessages.push(`Max allowed file size is ${maxFileSize} MB. `);
    }
    if (numberError) {
      errorMessages.push(`Max number of files is ${maxFileNumber}.`);
    }
    if (errorMessages.length || error) {
      this.setState({ error: errorMessages });
    }
    setValue({ base64, fileList });
    events.onChange && events.onChange();
  };

  onRemove = (index) => () => {
    const { fieldApi, fieldState } = this.props;
    const { value = {} } = fieldState;
    const { setValue } = fieldApi;
    this.setState({ error: null });
    setValue({
      base64: value.base64.filter((_, i) => index !== i),
      fileList: value.fileList.filter((_, i) => index !== i)
    });
  };

  renderImage = (image, index) => (
    <div className={styles.imgContainer} key={`${index + 1}`}>
      <img
        src={image}
        alt=""
        className={styles.imgThumb}
        ref={ref => Holder.run({ images: ref })}
      />
      <div className={styles.imgRemove} onClick={this.onRemove(index)}>
        <CloseIcon />
      </div>
    </div>
  );

  renderVideo = (video, index) => (
    <div className={styles.videoContainer} key={`${index + 1}`}>
      <video className={styles.imgThumb} controls>
        <source type="video/webm" src={video} />
        <source type="video/mp4" src={video} />
      </video>
      <div className={styles.imgRemove} onClick={this.onRemove(index)}>
        <CloseIcon />
      </div>
    </div>
  );

  renderFiles = () => {
    const { fieldState } = this.props;
    const { value } = fieldState;
    if (value && value.base64 && value.base64.length) {
      return (
        <div className="d-flex flex-wrap">
          {value.base64.map((file, index) =>
            value.fileList[index].type.includes('image')
              ? this.renderImage(file, index)
              : this.renderVideo(file, index)
          )}
        </div>
      );
    }
    return null;
  };

  renderInputField = () => {
    const { label } = this.props;
    if (!this.props.hideInput) {
      return (
        <div className="d-flex flex-column align-items-start">
          <div className={styles.addPicture}>
            {label}
          </div>
        </div>
      );
    }
    return null;
  };

  openFileInput = () => {
    this.readerRef.current.clickInput();
  }

  render () {
    const { error } = this.state;
    return (
      <React.Fragment>
        <ReactFileReader
          ref={this.readerRef}
          base64={true}
          handleFiles={this.handleFiles}
          multipleFiles
          fileTypes={this.props.fileTypes}
        >
          {this.props.renderCustomInputField ? this.props.renderCustomInputField() : this.renderInputField()}
        </ReactFileReader>
        {error && <AlertErrors message={error} />}
        {this.renderFiles()}
      </React.Fragment>
    );
  }
}

MultipleFiles.propTypes = {
  events: PropTypes.shape({
    onChange: PropTypes.func
  }),
  fieldApi: PropTypes.shape({
    setValue: PropTypes.func
  }),
  fieldState: PropTypes.shape({
    value: PropTypes.shape({
      base64: PropTypes.arrayOf(PropTypes.string),
      fileList: PropTypes.arrayOf(PropTypes.string)
    })
  }),
  hideInput: PropTypes.bool,
  fileTypes: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  maxFileNumber: PropTypes.number,
  maxFileSize: PropTypes.number,
  renderCustomInputField: PropTypes.func
};

MultipleFiles.defaultProps = {
  fileTypes: ['image/*'],
  label: 'Add image',
  maxFileNumber: 2,
  maxFileSize: 10
};

export default asField((props) => <MultipleFiles ref={props.forwardedRef} {...props} />);
