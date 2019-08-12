import React from 'react';
import PropTypes from 'prop-types';
import { Form, Text } from 'informed';
import { Button, Col, FormGroup, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { btnSpinner } from 'components/helpers';
import {
  CustomSelect,
  CustomMultiSelect,
  ImageInput,
  Divider,
  FieldType
} from 'components/helpers/form_fields';

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
      <FormGroup row>
        {renderField(field, props)}
      </FormGroup>
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

export { renderField, renderFields, renderFieldsWithGrid, renderButtons, renderForm, renderInput };