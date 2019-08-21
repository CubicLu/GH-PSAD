import React from 'react';
import { Alert} from 'reactstrap';

const AlertError = (props) => {
  const { message, response } = props
  console.log(response)
  return (
    <Alert time={Date.now()} color="danger">
        {message}
    </Alert>
  )
}

export default AlertError;