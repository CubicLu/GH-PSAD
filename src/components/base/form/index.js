import { Button, Col, FormGroup, Label } from 'reactstrap';
import React from 'react';
import { labelFor } from 'components/helpers/forms';
import * as FieldType from 'components/base/common_form/field_types';
import { Form, Text } from 'informed';
import { Link } from 'react-router-dom';
import ImageInput from 'components/base/common_form/fields/image';
import CustomSelect from 'components/base/common_form/fields/custom_select';
import CustomMultiSelect from 'components/base/common_form/fields/custom_select/multi';
import { btnSpinner } from 'components/helpers';

const renderField = (field, props = {}) => {
  if (field.fields) {
    return renderFields(field.fields, Object.assign(
      {},
      props,
      { prefix: `${field.name}.` }
      )
    );
  }

  const { lSize = 2, iSize = 6, prefix = '' } = props;
  const fieldName = `${prefix}${field.name}`;

  return (
    <FormGroup row>
      <Label for={fieldName} md={lSize}>{labelFor(field)}</Label>
      <Col md={iSize}>
        {field.render ? field.render(field, fieldName, props) : renderInput(field, fieldName, props)}
      </Col>
    </FormGroup>
  );
};

const renderInput = (field, fieldName, props = {}) => {
  switch (field.type) {
    case FieldType.MULTISELECT_FIELD:
      const { values = [] } = props;
      return <CustomMultiSelect fieldName={fieldName} options={field.options} values={values}/>;
    case FieldType.FILE_FIELD:
      return <ImageInput className="form-control" field={fieldName}/>;
    case FieldType.SELECT_FIELD:
      return <CustomSelect field={fieldName} options={field.options}/>;
    default:
      return <Text className="form-control" field={fieldName}/>;
  }
};

const renderFields = (fields, props = {}) => (
  fields.map((field, idx) => {
    return (
      <React.Fragment key={idx}>
        {renderField(field, props)}
      </React.Fragment>);
  })
);

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
  const { values, isFetching, fields } = props;

  return (
    <fieldset disabled={isFetching}>
      <Form initialValues={values} component={({ formState }) => (
        <React.Fragment>
          {renderFields(fields)}
          {renderButtons(formState, props)}
        </React.Fragment>
      )}/>
    </fieldset>
  );
};

export { renderField, renderFields, renderButtons, renderForm, renderInput };
