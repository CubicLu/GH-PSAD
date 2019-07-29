import { Select, Option } from 'informed';
import React from 'react';

const CustomSelect = props => {
  const { field, options = [] } = props;

  return (
    <Select className="form-control" field={field.name}  type="select" >
      <Option value="" disabled>Select One...</Option>
      {
        field.options.map((option, idx) => (<Option key={idx} value={option.value} disabled={option.disabled || false}>{option.label}</Option>))
      }
    </Select>
  )
};

export default CustomSelect;
