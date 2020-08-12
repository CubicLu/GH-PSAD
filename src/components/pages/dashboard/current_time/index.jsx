import React, { useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const CurrentTime = ({ className }) => {
  const getCurrentTime = () => `${moment.utc().utcOffset('-0500').format('ddd M/D/YYYY hh:mm:ss')} EST`;
  const [currentTime, updateTime] = useState('');

  useEffect(() => {
    setInterval(() => {
      updateTime(getCurrentTime());
    }, 1000);
  });

  return (
    <span className={className || ''}>
      {currentTime}
    </span>
  );
};

CurrentTime.propTypes = {
  className: PropTypes.string
};

export default CurrentTime;
