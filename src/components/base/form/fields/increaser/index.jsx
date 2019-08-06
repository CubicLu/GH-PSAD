import React from 'react';
import { useField } from 'informed';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { isUndefined } from 'underscore';

const validate = (fieldApi, min, max, renderValue, value) => {
  if (fieldApi.getError()) return undefined;

  if (!isUndefined(min) && value < min) {
    fieldApi.setError(`${renderValue(value)} is less than ${renderValue(min)}`);
  }

  if (!isUndefined(max) && value > max) {
    fieldApi.setError(`${renderValue(value)} is more than ${renderValue(max)}`);
  }
};

const Increaser = props => {
  const { field } = props;
  const { fieldState, fieldApi } = useField({ field: field.name });
  const { value } = fieldState;
  const { setValue } = fieldApi;
  const { renderValue, step, min, max } = field;

  validate(fieldApi, min, max, renderValue, value);

  return (
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <Button color="secondary" outline onClick={() => setValue(value - step)}>
          -
        </Button>
      </InputGroupAddon>
      <Input className="text-center" value={renderValue(value)} readOnly plaintext/>
      <InputGroupAddon addonType="append">
        <Button color="secondary" outline onClick={() => setValue(value + step)}>
          +
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default Increaser;
