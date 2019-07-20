import React, { useState } from 'react';
import MultiSelect from 'react-select';
import { isEmpty } from 'underscore';
import { Text } from 'informed';

function MultiSelectCustom ({options, values, field_name}) {
  const [selectedOptions, setSelectedOptions] = useState({});

  if(isEmpty(selectedOptions) && values[field_name]) {
    setSelectedOptions({
      [field_name]: values[field_name].map(element => ({value: element.id, label: element.email}))
    })
  }

  return (
    <React.Fragment>
      <MultiSelect
        isMulti
        value={selectedOptions[field_name]}
        onChange={(selectedOptions) => {
          setSelectedOptions({ [field_name]: selectedOptions})
        }}
        options={options}
      />
      {selectedOptions[field_name] && selectedOptions[field_name].map(({ label, value}, i) => {
        return <Text
          key={label}
          hidden
          field={`${field_name}[${i}]`}
          initialValue={value}
        />
      })}
    </React.Fragment>
  )
}

export default MultiSelectCustom;