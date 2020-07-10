import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';

const CurrentTime = (props) => {
  const getCurrentTime = (callback) => {
    axios.get('https://worldclockapi.com/api/json/est/now').then(data => {
      callback(data.data);
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
