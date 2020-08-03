import React from 'react';
import { Form, Text } from 'informed';
import { Button, Col, FormGroup, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import { btnSpinner } from 'components/helpers';
import {
  CustomSelect,
  CustomMultiSelect,
  DateRangeInput,
  FieldType,
} from 'components/helpers/form_fields';
import Loader from 'components/helpers/loader';

class FilterForm extends React.Component {
  renderField = (field, key) => (
    <FormGroup row key={key}>
      <Label for={field.name} sm={2}>{field.label}</Label>
      <Col sm={10}>
        {this.renderInput(field)}
      </Col>
    </FormGroup>
  );

  renderInput = field => {
    switch (field.type) {
      case FieldType.DATE_FIELD:
        return <DateRangeInput className="form-control" field={field.name} initialValues={this.props.values} />;
      case FieldType.MULTISELECT_FIELD:
        return <CustomMultiSelect field={field.name} options={field.options} values={this.props.values} />;
      case FieldType.SELECT_FIELD:
        return <CustomSelect field={field} selectOneEnabled />;
      default:
        return <Text className="form-control" {...field.props} field={field.name} validate={field.validate} />;
    }
  };

  renderFields = () => {
    const { fields } = this.props;
    return fields.map((field, idx) => this.renderField(field, idx));
  };

  renderButtons = formState => {
    const { cancelFilter, submitForm, isFetching } = this.props;

    return (
      <div className="text-center mt-4">
        <Button onClick={cancelFilter} className="btn btn-danger mr-1">
          Cancel
        </Button>
        <Button onClick={() => submitForm(formState.values)} color="info" type="submit">
          {isFetching() ? btnSpinner() : 'Apply'}
        </Button>
      </div>
    );
  };

  renderForm = ({ formState }) => (
    <React.Fragment>
      {this.renderFields()}
      {this.renderButtons(formState)}
    </React.Fragment>
  );

  render () {
    const { values, isFetching } = this.props;
    return (
      isFetching() ? <Loader /> : <Form initialValues={values} component={this.renderForm} />
    );
  }
};

FilterForm.propTypes = {
  cancelFilter: PropTypes.func,
  fields: PropTypes.object.isRequired,
  isFetching: PropTypes.bool,
  submitForm: PropTypes.func,
  values: PropTypes.shape({}),
};

export default FilterForm;
