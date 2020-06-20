import React from 'react';
import PropTypes from 'prop-types';

import styles from './button.module.sass';

const Button = ({ children, onClick, className, icon, status = 'primary', ...otherProps }) => {
  return (
    <button
      className={`${styles.button} ${styles[`button-${status}`]} ${className || ''}`}
      onClick={onClick}
      {...otherProps}
    >
      {!!icon &&
        <div>
          {icon}
        </div>
      }
      <span>
        {children}
      </span>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  status: PropTypes.string
};

export default Button;
