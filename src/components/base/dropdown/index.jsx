import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DropdownMenu, DropdownItem, DropdownToggle, Dropdown } from 'reactstrap';
import { ReactComponent as ChevronDown } from 'assets/chevron_down.svg';
import { ReactComponent as ChevronUp } from 'assets/chevron_up.svg';
import styles from './dropdown.module.sass';

const buttonSizeStyleMap = {
  sm:
  {
    padding: '8px 12px',
    fontSize: '12'
  },
  md:
  {
    padding: '10px 14px',
    fontSize: '13'
  }
};

const CustomDropdown = ({ options, onChange, defaultOption, width = '100%', buttonSize = 'md' }) => {
  const [selectedOption, setSelectedOption] = useState(defaultOption || options[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleToggle = () => setDropdownOpen(prevState => !prevState);

  const handleItemClick = (option) => {
    const { value } = option;
    if (value === selectedOption.value) {
      return;
    }
    setSelectedOption(option);
    if (value === 0) {
      onChange();
      return;
    }
    onChange([value]);
  };

  const btnSizeStyle = buttonSizeStyleMap[buttonSize];
  const dropdownModifiers = {
    setMaxHeight: {
      enabled: true,
      fn: (data) => ({
        ...data,
        styles: {
          ...data.styles,
          overflow: 'auto',
          maxHeight: `${144 + btnSizeStyle.fontSize * 6}px`,
          minWidth: width,
          maxWidth: width,
          transform: data.styles.transform + ' translateX(0)'
        }
      })
    }
  };
  const btnStyle = {
    width,
    padding: btnSizeStyle.padding
  };
  const btnTextStyle = {
    fontSize: btnSizeStyle.fontSize + 'px'
  };
  return (
    <Dropdown
      className={styles.dropdown}
      isOpen={dropdownOpen}
      toggle={handleToggle}
    >
      <DropdownToggle
        className={`${dropdownOpen ? styles.noneBorderBottom : ''} d-flex justify-content-between align-items-center`}
        style={btnStyle}
      >
        <span
          className="general-text-2"
          style={btnTextStyle}
        >
          {selectedOption ? selectedOption.label : ''}
        </span>
        {dropdownOpen
          ? <ChevronUp width="12" height="12" />
          : <ChevronDown width="12" height="12" />
        }
      </DropdownToggle>
      <DropdownMenu
        right
        className="mt-0 py-0"
        modifiers={dropdownModifiers}
      >
        {options.map((option, i) =>
          <DropdownItem key={i} onClick={() => handleItemClick(option)}>
            <span
              className="general-text-2 d-flex align-items-center"
              style={btnTextStyle}
            >
              {option.label}
            </span>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

CustomDropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string
  })).isRequired,
  defaultOption: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string
  }),
  onChange: PropTypes.func.isRequired,
  width: PropTypes.string,
  buttonSize: PropTypes.string
};

export default CustomDropdown;
