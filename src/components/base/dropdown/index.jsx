import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DropdownMenu, DropdownItem, DropdownToggle, Dropdown } from 'reactstrap';
import { ReactComponent as ChevronDown } from 'assets/chevron_down.svg';
import { ReactComponent as ChevronUp } from 'assets/chevron_up.svg';
import styles from './dropdown.module.sass';

const CustomDropdown = ({
  options,
  customOptions,
  onChange,
  defaultOption,
  width = '100%',
  size = 'md',
  className,
  selectedOptionClassName
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultOption || options[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleToggle = () => setDropdownOpen(prevState => !prevState);

  const handleItemClick = (option) => {
    const { value } = option;
    if (value === selectedOption.value) {
      return;
    }
    setSelectedOption(option);
    onChange([value]);
  };

  const dropdownModifiers = {
    setMaxHeight: {
      enabled: true,
      fn: (data) => ({
        ...data,
        styles: {
          ...data.styles,
          overflow: 'auto',
          maxHeight: size === 'sm' ? '216px' : '222px',
          minWidth: width,
          maxWidth: width,
          transform: `${data.styles.transform} translateX(0)`
        }
      })
    }
  };
  const btnStyle = {
    width
  };
  return (
    <Dropdown
      className={`${styles.dropdown} ${styles[`dropdown-${size}`]} ${className || ''}`}
      isOpen={dropdownOpen}
      toggle={handleToggle}
    >
      <DropdownToggle
        className={`${dropdownOpen ? styles.noneBorderBottom : ''} d-flex justify-content-between align-items-center`}
        style={btnStyle}
      >
        <span className="general-text-2">
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
        {options.map((option, i) => {
          const isSelectedOption = selectedOption && selectedOption.value === option.value;
          return (
            <DropdownItem
              key={i}
              onClick={() => handleItemClick(option)}
              className={isSelectedOption ? selectedOptionClassName : ''}
            >
              <span className="general-text-2 d-flex align-items-center">
                {option.label}
              </span>
            </DropdownItem>
          );
        })}
        {customOptions && customOptions.map(({ label, onClick, className }, i) =>
          <DropdownItem key={i} onClick={onClick} className={className || ''}>
            <span className="general-text-2 d-flex align-items-center">
              {label}
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
  customOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string
  })),
  defaultOption: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string
  }),
  onChange: PropTypes.func.isRequired,
  width: PropTypes.string, // width can be 100% or number px
  size: PropTypes.string, // we have 2 size sm and md
  className: PropTypes.string,
  selectedOptionClassName: PropTypes.string
};

export default CustomDropdown;
