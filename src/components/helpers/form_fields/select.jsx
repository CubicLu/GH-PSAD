import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option } from 'informed';

const CustomSelect = props => {
  const { field } = props;

  return (
    <Select className='form-control' {...props.events} disabled={field.disabled} field={field.name} type='select' >
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
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ])
    }))
  })
};

export default CustomSelect;
