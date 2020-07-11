import React from 'react';
import PropTypes from 'prop-types';

import styles from './button.module.sass';

const Button = ({ children, onClick, className, icon, status = 'primary', size = 'sm', ...otherProps }) => {
  return (
    <button
      className={`${styles.button} ${styles[`button-${status}`]} ${styles[`button-${size}`]} ${className || ''}`}
      onClick={onClick}
      {...otherProps}
    >
      {!!icon &&
        <div>
          {icon}
        </div>
      }
      {!!children &&
        <span>
          {children}
        </span>
      }
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  status: PropTypes.string,
  size: PropTypes.string
};

export default Button;
