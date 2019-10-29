import React from 'react';
import {ReactComponent as Error} from 'assets/error_icon.svg'
import styles from './error.module.sass'

const ErrorWrapper = (props) => {
  const { errors = {}, field } = props;

  return (
    <div className={`position-relative ${errors[field.name] ? 'input-error' : ''}`}>
      {props.children}
      <Error className={`${errors[field.name] ? 'd-md-none d-lg-block' : 'd-none' } ${styles.WarningIcon} position-absolute`}/>
      <div className="text-left general-error general-text-1 pt-1">
        {errors[field.name] ? errors[field.name][0] : ''}
      </div>
    </div>
  )
}

export default ErrorWrapper;