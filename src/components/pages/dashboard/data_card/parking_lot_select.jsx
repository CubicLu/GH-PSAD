import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MultiSelect from 'react-select';
import withCurrentUser from 'components/modules/with_current_user';

const dropdownStyles = {
  clearIndicator: (provided, state) => ({
    ...provided,
    display: 'none'
  })
}

const defaultValue = {
  label: 'All Parking Lots',
  value: 0
}

const ParkingLotSelect = (props) => {
  const { options, updateData } = props
  const [currentSelectedOptions, setSelectedOptions] = useState(defaultValue);

  return (
    <React.Fragment>
      <MultiSelect
        isMulti
        styles={dropdownStyles}
        value={currentSelectedOptions}
        onChange={(newSelectedOptions, elementSelected) => {
          if (!newSelectedOptions || (elementSelected.option && elementSelected.option.value === 0)) {
            setSelectedOptions(defaultValue)
            updateData()
          } else {
            const parkingLots = newSelectedOptions.filter(option => option.value !== 0)
            setSelectedOptions(parkingLots)
            updateData(parkingLots.map(option => option.value))
          }

        }}
        options={options}
      />
    </React.Fragment>
  );
}

ParkingLotSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  })),
  values: PropTypes.object
};

export default withCurrentUser(ParkingLotSelect);
