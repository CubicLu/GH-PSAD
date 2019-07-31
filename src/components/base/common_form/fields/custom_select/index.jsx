import { Select, Option } from 'informed';
import React from 'react';
import PropTypes from 'prop-types';

const CustomSelect = props => {
  const { field } = props;

  return (
    <Select className='form-control' field={field.name} type='select' >
      <Option value='' disabled>Select One...</Option>
      {
        field.options.map((option, idx) => (<Option key={idx} value={option.value} disabled={option.disabled || false}>{option.label}</Option>))
      }
    </Select>
  );
};

CustomSelect.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    }))
  })
};

export default CustomSelect;
