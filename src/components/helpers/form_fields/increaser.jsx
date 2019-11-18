import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'informed';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { isUndefined } from 'underscore';

const Increaser = props => {
  const { field, events, formState } = props;
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
    <React.Fragment>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <Button color="secondary" outline onClick={onDecrease}>
            -
          </Button>
        </InputGroupAddon>
        <Input className={`${formState.errors[field.name] ? 'input-error' : ''} text-center`} value={renderValue(value)} readOnly plaintext/>
        <InputGroupAddon addonType="append">
          <Button color="secondary" outline onClick={onIncrease}>
            +
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <div className="text-center general-error general-text-1 pt-1">
        {formState.errors[field.name] ? formState.errors[field.name] : '' }
      </div>
    </React.Fragment>
  );
};

Increaser.propTypes = {
  field: PropTypes.object.isRequired
};

export default Increaser;
