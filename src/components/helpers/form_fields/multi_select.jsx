import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MultiSelect from 'react-select';
import { isEmpty, defaults } from 'underscore';
import { Text } from 'informed';

function CustomMultiSelect ({ options, values, fieldName }) {
  const [selectedOptions, setSelectedOptions] = useState({});
  values = defaults(values, {});

  if (isEmpty(selectedOptions) && values[fieldName]) {
    setSelectedOptions({
      [fieldName]: options.filter(element => values[fieldName].includes(element.value))
    });
  }
  return (
    <React.Fragment>
      <MultiSelect
        isMulti
        value={selectedOptions[fieldName]}
        onChange={(selectedOptions) => {
          setSelectedOptions({ [fieldName]: selectedOptions });
        }}
        options={options}
      />
      {selectedOptions[fieldName] && selectedOptions[fieldName].map(({ label, value }, i) => {
        return <Text
          key={label}
          hidden
          field={`${fieldName}[${i}]`}
          initialValue={value}
        />;
      })}
    </React.Fragment>
  );
}

CustomMultiSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  })),
  values: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired
};

export default CustomMultiSelect;
