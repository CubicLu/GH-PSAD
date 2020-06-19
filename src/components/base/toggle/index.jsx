import React from 'react';
import PropTypes from 'prop-types';
import styles from './toggle.module.sass';

const Toggle = ({ value, onChange, label, positiveText = 'YES', negativeText = 'NO' }) => {
  return (
    <div className="d-flex align-items-center">
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
      {!!label &&
        <span className="general-text-2">{label}</span>
      }
    </div>
  );
};

Toggle.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  positiveText: PropTypes.string,
  negativeText: PropTypes.string
};

export default Toggle;
