import React, { useState } from 'react';
import { asField } from 'informed';
import { Button, Col, Row, Label} from 'reactstrap';
import { unixDatePicker } from 'components/helpers';


const fromStringDateToDate = (stringDate) => {
    const splittedStringDate = stringDate.split('-')
    var day = splittedStringDate[2];
    var month = splittedStringDate[1] - 1;
    var year = splittedStringDate[0];
    return new Date(year, month, day)
}

const setInitialValues = (initialValues, field_name) => {
  if(!initialValues || !initialValues[field_name]) {
    return [null, null]
  }
  let from = null, to = null

  if(initialValues[field_name].from) {
    from = fromStringDateToDate(initialValues[field_name].from)
  }

  if(initialValues[field_name].to) {
    to = fromStringDateToDate(initialValues[field_name].to)
  }
  return [from, to]
}

const DateRangeInput = asField(({ fieldState, fieldApi, ...props }) => {
  const { setValue } = fieldApi;
  const { value } = fieldState;
  const { initialValues, field } = props;

  const [initialStartDate, initialEndDate] = setInitialValues(initialValues, field)
  const [ startDate, setStartDate ] = useState(initialStartDate);
  const [ endDate, setEndDate ] = useState(initialEndDate);

  const clearDate = () => {
    setValue({})
    setStartDate(null)
    setEndDate(null)
  }

  const formatDate = (date) => {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return `${year}-${month}-${day}`
  }

  return (
      <Row>
        <Col sm={12} md={6}>
          <Label>
            From:
          </Label>
            {
              unixDatePicker(startDate, null, {
                selected: startDate,
                onChange: date => {
                  setValue({
                    from: formatDate(date)
                  })
                  setStartDate(date);
                }
              })
            }
        </Col>
        <Col sm={12} md={6}>
          <Label>
          To:
          </Label>
            {
              unixDatePicker(endDate, null, {
                selected: endDate,
                onChange: date => {
                  setValue({
                    ...value,
                    to: formatDate(date)
                  })
                  setEndDate(date);
                }
              })
            }
        </Col>
        <Col sm={4} className="mt-2 mb-2">
          <Button color="primary" onClick={clearDate}>
            Clear Date
          </Button>
        </Col>
      </Row>
  );
});

export default DateRangeInput;