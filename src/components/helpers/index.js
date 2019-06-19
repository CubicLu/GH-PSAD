import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
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

const btnSpinner = () => {
  return (
    <span>
        Loading...
        <Spinner className="ml-1" size="sm" color="default"/>
      </span>
  )
};

export { momentUnix, displayUnixTimestamp, unixDatePicker, dateToUnix, btnSpinner };
