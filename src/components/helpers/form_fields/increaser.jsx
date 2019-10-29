import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'informed';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { isUndefined } from 'underscore';

const Increaser = props => {
  const { field, events } = props;
  const { fieldState, fieldApi } = useField({ field: field.name });
  const { value } = fieldState;
  const { setValue } = fieldApi;
  const { renderValue, step, min, max } = field;

  const onIncrease = () => {
    const newValue = value + step;

    if (!isUndefined(max) && newValue > max) {
      fieldApi.setError(`cannot be more than ${renderValue(max)}`);
    } else {
      fieldApi.setError(undefined);
      events.onChange();
      setValue(newValue);
    }
  };

  const onDecrease = () => {
    const newValue = value - step;

    if (!isUndefined(min) && newValue < min) {
      fieldApi.setError(`cannot be less than ${renderValue(min)}`);
    } else {
      fieldApi.setError(undefined);
      events.onChange();
      setValue(newValue);
    }
  };

  return (
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <Button color="secondary" outline onClick={onDecrease}>
          -
        </Button>
      </InputGroupAddon>
      <Input className="text-center" value={renderValue(value)} readOnly plaintext/>
      <InputGroupAddon addonType="append">
        <Button color="secondary" outline onClick={onIncrease}>
          +
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
};

Increaser.propTypes = {
  field: PropTypes.object.isRequired
};

export default Increaser;
