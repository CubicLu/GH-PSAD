import React, { useState } from 'react';
import MultiSelect from 'react-select';
import { isEmpty } from 'underscore';
import { Text } from 'informed';

function MultiSelectCustom({ options, values, fieldName }) {
  const [selectedOptions, setSelectedOptions] = useState({});

  if (isEmpty(selectedOptions) && values[fieldName]) {
    setSelectedOptions({
      [fieldName]: values[fieldName].map(element => ({ value: element.id, label: element.email }))
    })
  }

  return (
    <React.Fragment>
      <MultiSelect
        isMulti
        value={selectedOptions[fieldName]}
        onChange={(selectedOptions) => {
          setSelectedOptions({ [fieldName]: selectedOptions })
        }}
        options={options}
      />
      {selectedOptions[fieldName] && selectedOptions[fieldName].map(({ label, value }, i) => {
        return <Text
          key={label}
          hidden
          field={`${fieldName}[${i}]`}
          initialValue={value}
        />
      })}
    </React.Fragment>
  )
}

export default MultiSelectCustom;
