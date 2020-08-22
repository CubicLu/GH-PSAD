import React from 'react';
import PropTypes from 'prop-types';
import { asField } from 'informed';
import ReactFileReader from 'react-file-reader';
import { ReactComponent as CloseIcon } from 'assets/close_icon.svg';
import { AlertMessagesContext } from 'components/helpers/alert_messages';

import styles from './multiple_files.module.sass';

class MultipleFiles extends React.Component {
  static contextType = AlertMessagesContext

  readerRef = React.createRef();

  handleFiles = data => {
    const { events, fieldApi, fieldState, maxFileNumber, maxFileSize, multipleFiles } = this.props;
    let { value = [] } = fieldState;
    const { setValue } = fieldApi;
    let newError = '';
    if (!multipleFiles) {
      data = { base64: [data.base64], fileList: data.fileList };
    }
    if (value.length + data.base64.length > maxFileNumber) {
      newError = `Max allowed number of files is ${maxFileNumber}.`;
    } else {
      const maxFileSizeInBytes = 1024 * 1024 * maxFileSize;
      data.base64.forEach((item, i) => {
        const file = data.fileList[i];
        if (file.size > maxFileSizeInBytes) {
          newError = `Max allowed file size is ${maxFileSize} MB.`;
        } else {
          value = [...value, item];
        }
      });
    }
    if (newError) {
      this.context.addAlertMessages([{
        type: 'Error',
        text: newError
      }]);
    } else {
      setValue(value);
      events.onChange && events.onChange();
    }
  };

  onRemove = (index) => () => {
    const { fieldApi, fieldState } = this.props;
    const { value = [] } = fieldState;
    const { setValue } = fieldApi;
    setValue(value.filter((_, i) => index !== i));
  };

  renderImage = (image, index) => (
    <div className={styles.imgContainer} key={index}>
      <img src={image} alt="" className={styles.imgThumb} />
      <div className={styles.imgRemove} onClick={this.onRemove(index)}>
        <CloseIcon />
      </div>
    </div>
  );

  renderVideo = (video, index) => (
    <div className={styles.videoContainer} key={index}>
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
    const { value = [] } = fieldState;
    if (value && value.length) {
      return (
        <div className="d-flex flex-wrap">
          {value.map((file, index) =>
            file.includes('data:image/')
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
    if (this.props.hideInput) {
      return <span />;
    }
    return (
      <div className="d-flex flex-column align-items-start">
        <div className={styles.addPicture}>
          {label}
        </div>
      </div>
    );
  };

  openFileInput = () => {
    const { fieldState, maxFileNumber } = this.props;
    const { value = [] } = fieldState;
    if (value.length < maxFileNumber) {
      this.readerRef.current.clickInput();
    }
  }

  render () {
    const { multipleFiles } = this.props;
    return (
      <React.Fragment>
        <ReactFileReader
          ref={this.readerRef}
          base64={true}
          handleFiles={this.handleFiles}
          multipleFiles={multipleFiles}
          fileTypes={this.props.fileTypes}
        >
          {this.props.renderCustomInputField ? this.props.renderCustomInputField() : this.renderInputField()}
        </ReactFileReader>
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
    value: PropTypes.arrayOf(PropTypes.string)
  }),
  hideInput: PropTypes.bool,
  fileTypes: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  maxFileNumber: PropTypes.number,
  maxFileSize: PropTypes.number,
  multipleFiles: PropTypes.bool,
  renderCustomInputField: PropTypes.func
};

MultipleFiles.defaultProps = {
  fileTypes: ['image/*'],
  label: 'Add image',
  maxFileNumber: 2,
  maxFileSize: 10,
  multipleFiles: false
};

export default asField((props) => <MultipleFiles ref={props.forwardedRef} {...props} />);
