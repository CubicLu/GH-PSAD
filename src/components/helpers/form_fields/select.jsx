import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Option } from 'informed';

const CustomSelect = (props) => {
  const [selected, setSelected] = useState(false);
  const { field } = props;

  const onChange = (event) => {
    if (selected !== !!event.target.value) {
      setSelected(!!event.target.value);
    }
  };

  return (
    <Select
      className="form-control"
      {...props.events}
      disabled={field.disabled}
      field={field.name}
      type="select"
      onChange={onChange}
    >
      <Option value="" disabled={!selected}>
        Select One...
      </Option>
      {field.options.map((option, idx) => (
        <Option
          key={idx}
          value={option.value}
          disabled={option.disabled || false}
        >
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

CustomSelect.propTypes = {
  events: PropTypes.shape({}),
  field: PropTypes.shape({
    name: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
  }),
};

export default CustomSelect;
