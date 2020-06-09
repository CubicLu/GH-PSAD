import React, { useState, useEffect } from 'react';
import moment from 'moment';

const CurrentTime = (props) => {
  const getCurrentTime = (callback) => {
    fetch('http://worldclockapi.com/api/json/est/now').
    then(resp => resp.json()).
    then(data => {
      callback(data);
    });
  }

  const formatDate = data => {
    return `${moment(data.currentDateTime, 'YYYY-M-DThh:mm').format('ddd M/D/YYYY hh:mm')} EST`;
  }

  const { className } = props;
  const [currentTime, updateTime] = useState('');

  getCurrentTime(data => {
    updateTime(formatDate(data));
  });

  useEffect(() => {
    setInterval(() => {
      getCurrentTime(data => {
        updateTime(formatDate(data));
      });
    }, 60000);
  });

  return(
    <span className={className || ''}>
      {currentTime}
    </span>
  )
}

export default CurrentTime;
