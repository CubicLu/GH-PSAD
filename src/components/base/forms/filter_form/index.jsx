import React from 'react';
import { Form, Text } from 'informed';
import { Col, FormGroup, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import { btnSpinner } from 'components/helpers';
import {
  CustomSelect,
  CustomMultiSelect,
  DateRangeInput,
  FieldType,
} from 'components/helpers/form_fields';
import Loader from 'components/helpers/loader';
import Button from 'components/base/button';
import styles from './filter_form.module.sass';

class FilterForm extends React.Component {
  renderField = (field, key) => (
    <FormGroup row key={key}>
      <Label
        className={`${styles.inputLabel} general-text-1`}
        for={field.name}
        xs={3}
      >
        {field.label}
      </Label>
      <Col xs={9}>
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
        return <CustomSelect field={field} emptyOptionEnabled />;
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
      <div className="d-flex justify-content-center mt-5">
        <Button
          className="mr-3 text-uppercase"
          onClick={cancelFilter}
          status="danger"
          size="md"
        >
          Cancel
        </Button>
        <Button
          className="text-uppercase"
          onClick={() => submitForm(formState.values)}
          status="success"
          type="submit"
          size="md"
        >
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
