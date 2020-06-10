import React, { useState } from 'react';
import PropTypes from 'prop-types';
import withCurrentUser from 'components/modules/with_current_user';
import { DropdownMenu, DropdownItem, DropdownToggle, Dropdown } from 'reactstrap';
import { ReactComponent as ChevronDown } from 'assets/chevron_down.svg';
import { ReactComponent as ChevronUp } from 'assets/chevron_up.svg';
import styles from './data_card.module.sass';

const defaultOption = {
  label: 'All Parking Lots',
  value: 0
}

const ParkingLotSelect = (props) => {
  const { options, updateData } = props
  const [selectedOption, setSelectedOption] = useState(defaultOption)

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => setDropdownOpen(prevState => !prevState)

  const dropdownModifiers = {
    setMaxHeight: {
      enabled: true,
      fn: (data) => ({
        ...data,
        styles: {
          ...data.styles,
          overflow: 'auto',
          maxHeight: '216px',
        },
      }),
    },
  }

  const handleItemClick = (option) => {
    const { value } = option
    if (value === selectedOption.value) {
      return
    }
    setSelectedOption(option)
    if (value === 0) {
      updateData()
      return
    }
    updateData([value])
  }

  return (
    <Dropdown
      className={styles.parkingLotDropdown}
      isOpen={dropdownOpen}
      toggle={toggle}
    >
      <DropdownToggle
        className={`${dropdownOpen ? styles.noneBorderBottom : ''} d-flex justify-content-between align-items-center`}
      >
        <span className="general-text-2">{selectedOption.label}</span>
        {dropdownOpen
          ? <ChevronUp width="12" height="12" />
          : <ChevronDown width="12" height="12" />
        }
      </DropdownToggle>
      <DropdownMenu
        right
        className={`${styles.parkingLotDropdownMenu} mt-0 py-0`}
        modifiers={dropdownModifiers}
      >
        {options.map((option, i) =>
          <DropdownItem key={i} onClick={() => handleItemClick(option)}>
            <span className="general-text-2 d-flex align-items-center">{option.label}</span>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}

ParkingLotSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string
  })),
};

export default withCurrentUser(ParkingLotSelect);
