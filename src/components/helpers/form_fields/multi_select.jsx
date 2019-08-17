import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MultiSelect from 'react-select';
import { isEmpty, defaults } from 'underscore';
import { Text, asField } from 'informed';

const CustomMultiSelect = asField(({field, fieldApi, fieldState, options}) => {

  let { value: values } = fieldState;
  const { setValue } = fieldApi;
  const [selectedOptions, setSelectedOptions] = useState({});

  values = defaults(values, {});

  if (isEmpty(selectedOptions) && !isEmpty(values)) {
    setSelectedOptions({
      [field]: options.filter(element => values.includes(element.value))
    });
  }
  return (
    <React.Fragment>
      <MultiSelect
        isMulti
        value={selectedOptions[field]}
        onChange={(selectedOptions) => {
          setValue( selectedOptions ? selectedOptions.map(element => element.value) : [])
          setSelectedOptions({ [field]: selectedOptions });
        }}
        options={options}
      />
    </React.Fragment>
  );
})

CustomMultiSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  })),
  values: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired
};

export default CustomMultiSelect;
