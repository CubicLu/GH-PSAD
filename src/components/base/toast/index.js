import React, { useState } from 'react';
import { Toast as BootstrapToast, ToastBody, ToastHeader } from 'reactstrap';

const Toast = (props) => {
  const { type, text } = props
  const [ isOpen, setIsOpen ] = useState(true)

  return (
    <BootstrapToast isOpen={isOpen}>
      <ToastHeader  icon={type} toggle={() => { setIsOpen(false)}}>
        {type}
      </ToastHeader>
      <ToastBody>
        {text}
      </ToastBody>
    </BootstrapToast>
  )
}

export default Toast;