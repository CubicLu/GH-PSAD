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

const extractMessage = error => {
  const { errors } = error.response.data;

  if (errors) {
    let errorsContainer = [];

    Object.keys(errors).forEach(function(key) {
      errors[key].map(text => errorsContainer.push(text))
    });

    return errorsContainer.map(text => ({ text, color: 'danger' }));
  } else {
    return [{ text: error.response.data, color: 'danger' }];
  }
};

const setErrorsMessages = error => {
    switch (error.status) {
      case 404:
        return [{ text: error.statusText, color: 'danger' }];
      case 500:
        return [{ text: 'Unexpected error', color: 'danger' }];
      default:
        return extractMessage(error);
    }
};

const setSuccessMessage = message => [{ text: message, color: "success"}];

export { 
  showMessages,
  setErrorsMessages,
  setSuccessMessage
};
