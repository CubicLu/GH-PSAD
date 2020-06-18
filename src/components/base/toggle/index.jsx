import React from 'react';
import PropTypes from 'prop-types';
import styles from './toggle.module.sass';

const Toggle = ({ value, onChange, positiveText = 'YES', negativeText = 'NO' }) => {
  return (
    <div
      className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
      onClick={() => onChange(!value)}
    >
      <div>
        <span>
          <span>{positiveText}</span>
        </span>
        <span>
          {negativeText}
        </span>
      </div>
    </div>
  );
};

Toggle.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  positiveText: PropTypes.string,
  negativeText: PropTypes.string
};

export default Toggle;
