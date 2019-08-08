import React, { useState } from 'react';
import MultiSelect from 'react-select';
import { isEmpty } from 'underscore';
import { Text } from 'informed';

function MultiSelectCustom({ options, values, name }) {
  const [selectedOptions, setSelectedOptions] = useState({});

  if (isEmpty(selectedOptions) && values[name]) {
    setSelectedOptions({
      [name]: values[name].map(element => ({ value: element.id, label: element.email }))
    })
  }

  return (
    <React.Fragment>
      <MultiSelect
        isMulti
        value={selectedOptions[name]}
        onChange={(selectedOptions) => {
          setSelectedOptions({ [name]: selectedOptions })
        }}
        options={options}
      />
      {selectedOptions[name] && selectedOptions[name].map(({ label, value }, i) => {
        return <Text
          key={label}
          hidden
          field={`${name}[${i}]`}
          initialValue={value}
        />
      })}
    </React.Fragment>
  )
}

export default MultiSelectCustom;
