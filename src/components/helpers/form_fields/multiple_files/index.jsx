import React from 'react';
import PropTypes from 'prop-types';
import { asField } from 'informed';
import Holder from 'holderjs';
import ReactFileReader from 'react-file-reader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';

import TooltipInfo from 'components/helpers/tooltip_info';

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
    const { fieldApi, fieldState, maxFileNumber, maxFileSize } = this.props;
    const { value } = fieldState;
    const { setValue } = fieldApi;
    const base64 = (value && value.base64) || [];
    const fileList = (value && value.fileList) || [];
    let sizeError = false;
    let numberError = false;
    const maxFileSizeInBytes = 1024 * 1024 * this.props.maxFileSize;
    data.base64.forEach((item, i) => {
      const file = data.fileList[i];
      const errorSize = file.size > maxFileSizeInBytes;
      const errorNumber = base64.length >= this.props.maxFileNumber;
      sizeError = sizeError || errorSize;
      numberError = numberError || errorNumber;
      if (!errorSize && !errorNumber) {
        base64.push(item);
        fileList.push(file);
      }
    });
    let errorMessage = '';
    if (sizeError) {
      errorMessage += `Max allowed file size is ${maxFileSize} MB.`;
    }
    if (numberError) {
      errorMessage += `Max number of files is ${maxFileNumber}.`;
    }
    if (errorMessage || error) {
      this.setState({ error: errorMessage });
    }
    setValue({ base64, fileList });
    this.props.events.onChange && this.props.events.onChange();
  };

  onRemove = (index) => () => {
    const { fieldApi, fieldState } = this.props;
    const { value } = fieldState;
    const { setValue } = fieldApi;
    const data = (value && { ...value }) || {};
    data.base64.splice(index, 1);
    data.fileList.splice(index, 1);
    setValue(data);
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
        <FontAwesomeIcon icon={faTimes} color="white" size="1x" />
      </div>
    </div>
  );

  renderVideo = (video, index) => (
    <div className={styles.imgContainer} key={`${index + 1}`}>
      <video className={styles.imgThumb} controls>
        <source type="video/webm" src={video} />
        <source type="video/mp4" src={video} />
      </video>
      <div className={styles.imgRemove} onClick={this.onRemove(index)}>
        <FontAwesomeIcon icon={faTimes} color="white" size="1x" />
      </div>
    </div>
  );

  renderFiles = () => {
    const { fieldState } = this.props;
    const { value } = fieldState;
    if (value && value.base64 && value.base64.length) {
      return (
        <div className="d-flex flex-row">
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
    if (!this.props.hideInput) {
      return (
        <div className="d-flex flex-column align-items-start">
          <div className={styles.addPicture}>
            <FontAwesomeIcon className="mr-2" icon={faCamera}/>
            this.props.label
          </div>
          <p className="pt-1 text-center">
            <span className="general-text-3">
              this.props.labelForTypes
            </span>
            <TooltipInfo className="ml-2" text="This are citation ticket files" target="picture" />
          </p>
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
        {error && <p className="general-error general-text-5">{error}</p>}
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
  maxFileNumber: PropTypes.number,
  maxFileSize: PropTypes.number,
  renderCustomInputField: PropTypes.func
};

MultipleFiles.defaultProps = {
  fileTypes: ['image/*', 'video/*'],
  maxFileNumber: 2,
  maxFileSize: 10
};

export default asField((props, ref) => <MultipleFiles ref={props.forwardedRef} {...props} />);
