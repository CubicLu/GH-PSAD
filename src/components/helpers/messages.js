import React from 'react';
import { isEmpty } from 'underscore';
import { UncontrolledAlert } from 'reactstrap';
import { map } from 'underscore';

const showMessages = messages => {
  if (isEmpty(messages)) return;

  return map(messages, (message, idx) => {
     return <UncontrolledAlert key={idx} color={message.color}>{message.text}</UncontrolledAlert>
  }).flat();
};

const setErrorsMessages = error => {
    let errors;
    if (error.response) {
      const allErrors = error.response.data.errors
      let errorsContainer = []
      Object.keys(allErrors).forEach(function(key) {
        allErrors[key].map(text => errorsContainer.push(text))
      })
      errors = errorsContainer.map(text => {
        return { text, color: 'danger' }
      })
    } else {
      if (error) {
        errors =  [{ text: error, color: 'danger' }]
      } else {
        errors =  [{ text: 'Unexpected error', color: 'danger' }]
      }
    }
    return errors
}

const setSuccessMessage = message => {
    return [{ text: message, color: "success"}]
}

export { 
  showMessages,
  setErrorsMessages,
  setSuccessMessage
};
