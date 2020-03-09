import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Col, FormGroup, Label, Row } from 'reactstrap';
import { labelFor } from 'components/helpers/forms';
import TooltipInfo from 'components/helpers/tooltip_info';
import {
  ImageInput,
  CustomSelect,
  CustomMultiSelect,
  TextWithLink,
  Increaser,
  Password,
  Toggler,
  GoogleMaps,
  FieldType,
} from 'components/helpers/form_fields';
import { Form, Text } from 'informed';
import { Link } from 'react-router-dom';
import { btnSpinner } from 'components/helpers';
import ErrorWrapper from './error'


const renderLabel = (field, props, lSize) => {

  const { errors = {} } = props
  let errorName = null
  errorName = field.prefix_error ? `${field.prefix_error}_${field.name}` : field.name

  return (
    field.label &&
    <Label for={field.name} md={lSize}>
      <span className={`mr-1 ${errors[errorName] ? 'general-error' : 'text-primary'}`}>{field.mandatory ? '*' : ''}</span>
      {labelFor(field)}
      {
        field.tooltip &&
        <TooltipInfo className="ml-2" text={field.tooltip} target={field.name} />
      }
    </Label>
  )
}

const renderField = (field, props = {}) => {

  const { lSize = 12, iSize = 6 } = props;

  return (
    <FormGroup row>
      {renderLabel(field, props, lSize)}
      <Col md={iSize}>
        <ErrorWrapper errors={props.errors} field={field}>
          {field.render ? field.render(field, props) : renderInput(field, props)}
        </ErrorWrapper>
      </Col>
    </FormGroup>
  );
};

const renderImageField = (field, props = {}) => (
  <FormGroup row>
    <Col md={12}>
      {field.render ? field.render(field, props) : renderInput(field, props)}
    </Col>
  </FormGroup>
);

const renderInput = (field, props = {}) => {
  switch (field.type) {
    case FieldType.MULTISELECT_FIELD:
      return <CustomMultiSelect {...props} field={field.name} options={field.options} />;
    case FieldType.FILE_FIELD:
      return <ImageInput {...props} className="form-control" field={field.name} />;
    case FieldType.SELECT_FIELD:
      return <CustomSelect {...props} field={field} />;
    case FieldType.TOGGLER_FIELD:
      return <Toggler {...props} field={field.name} label={field.innerLabel} options={field.options} />;
    case FieldType.TEXT_LINK_FIELD:
      return <TextWithLink {...props} field={field} />;
    case FieldType.PASSWORD_FIELD:
      return <Password {...props} field={field} />;
    case FieldType.GOOGLE_MAPS_FIELD:
      return <GoogleMaps {...props.events} {...field.options} />;
    case FieldType.INCREASER_FIELD:
      return <Increaser {...props} field={field} />;
    case FieldType.NUMBER_FIELD:
      return <Text className="form-control" disabled={field.disabled} {...props.events} type="number" field={field.name} />;

    default:
      return <Text className="form-control" disabled={field.disabled} {...props.events} field={field.name}  />;
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
  const fieldList = [];
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
        {isFetching() ? btnSpinner() : 'Save'}
      </Button>
    </React.Fragment>
  );
};

const renderFormErrors = (formState, fields) => {
  const { errors } = formState;
  const alerts = [];

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
    <fieldset disabled={isFetching()}>
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

renderField.propTypes = {
  lSize: PropTypes.number,
  iSize: PropTypes.number
};

renderButtons.propTypes = {
  isFetching: PropTypes.func.isRequired,
  backPath: PropTypes.string.isRequired
};

renderForm.propTypes = {
  values: PropTypes.object,
  isFetching: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired
};

export { renderField, renderFields, renderFieldsWithGrid, renderFormErrors, renderButtons, renderForm, renderInput, renderImageField };
