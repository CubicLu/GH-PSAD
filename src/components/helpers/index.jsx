import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input, Spinner } from 'reactstrap';

const momentUnix = timestamp => {
  return moment.unix(timestamp);
};

const displayUnixTimestamp = timestamp => {
  return momentUnix(timestamp).format('ddd, MMM Do YYYY, h:mm:ss a');
};

const unixDatePicker = (timestamp, inputProps, pickerProps) => {
  return (
    <DatePicker selected={momentUnix(timestamp).toDate()} customInput={<Input {...inputProps}/>} {...pickerProps}/>
  )
};

const dateToUnix = date => {
  return date.getTime() / 1000;
};

const btnSpinner = (props = {}) => {
  return (
    <span>
        Loading...
        <Spinner {...props} size="sm" color="default"/>
      </span>
  )
};

const camelize = (text, separator = '_') => (
  text.split(separator)
    .map(w => w.replace(/./, m => m.toUpperCase()))
    .join(' ')
);

export { momentUnix, camelize, displayUnixTimestamp, unixDatePicker, dateToUnix, btnSpinner };