import React from 'react';
import { Alert, Button, Col, FormGroup, Label, Row } from 'reactstrap';
import { labelFor } from 'components/helpers/forms';
import * as FieldType from './field_types';
import { Form, Text } from 'informed';
import { Link } from 'react-router-dom';
import ImageInput from './fields/image';
import CustomSelect from './fields/custom_select';
import CustomMultiSelect from './fields/custom_select/multi';
import { btnSpinner } from 'components/helpers';
import TextWithLink from './fields/text_with_link';
import Increaser from './fields/increaser';

const renderField = (field, props = {}) => {
  const { lSize = 2, iSize = 6 } = props;

  return (
    <FormGroup row>
      <Label for={field.name} md={lSize}>{labelFor(field)}</Label>
      <Col md={iSize}>
        {field.render ? field.render(field, props) : renderInput(field, props)}
      </Col>
    </FormGroup>
  );
};

const renderInput = (field, props = {}) => {
  switch (field.type) {
    case FieldType.MULTISELECT_FIELD:
      const { values = [] } = props;
      return <CustomMultiSelect field={field} values={values}/>;
    case FieldType.FILE_FIELD:
      return <ImageInput className="form-control" field={field.name}/>;
    case FieldType.SELECT_FIELD:
      return <CustomSelect field={field}/>;
    case FieldType.TEXT_LINK:
      return <TextWithLink field={field}/>;
    case FieldType.INCREASER:
      return <Increaser field={field}/>;
    default:
      return <Text className="form-control" field={field.name}/>;
  }
};

const renderFields = (fields, props = {}) => (
  fields.map((field, idx) => (
    <React.Fragment key={idx}>
      {renderField(field, props)}
    </React.Fragment>)
  )
);

const renderFieldsWithGrid = (fields, step, cols, props = {}) => {
  let fieldList = [];
  let start = 0;

  while (start < fields.length) {
    const mappedFields = fields.slice(start, start + step)
      .map((field, idx) => <Col key={idx} md={cols}>{renderField(field, props)}</Col>);
    fieldList.push((<Row key={start}>{mappedFields}</Row>));
    start += step;
  }

  return fieldList;
};

const renderButtons = (formState, props = {}) => {
  const { backPath, isFetching } = props;

  return (
    <React.Fragment>
      <Link to={backPath} className="btn btn-primary mr-1">Back</Link>
      <Button color="success" type="submit">
        {isFetching ? btnSpinner() : 'Save'}
      </Button>
    </React.Fragment>
  );
};

const renderFormErrors = (formState, fields) => {
  const { errors } = formState;
  let alerts = [];

  fields.forEach((field, idx) => {
    if (!errors[field.name]) return;

    alerts.push(
      <Alert key={idx} color="danger">
        {`${labelFor(field)} ${errors[field.name]}`}
      </Alert>
    );
  });

  return alerts;
};

const renderForm = (props = {}) => {
  const { values, isFetching, submitForm, fields } = props;

  return (
    <fieldset disabled={isFetching}>
      <Form onSubmit={submitForm} initialValues={values}>
        {({ formState }) => (
          <React.Fragment>
            {renderFields(fields)}
            {renderButtons(formState, props)}
          </React.Fragment>
        )}
      </Form>
    </fieldset>
  );
};

export { renderField, renderFields, renderFieldsWithGrid, renderFormErrors, renderButtons, renderForm, renderInput };
