import React from 'react';
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
import PropTypes from 'prop-types';

class CommonForm extends React.Component {
  renderField = (field, key) => (
    <FormGroup row key={key}>
      { field.divider && <Divider info={field.divider}/> }
      <Label for={field.name} sm={2}>{field.label}</Label>
      <Col sm={10}>
        {this.renderInput(field)}
      </Col>
    </FormGroup>
  );

  renderInput = field => {
    switch (field.type) {
      case FieldType.MULTISELECT_FIELD:
        return <CustomMultiSelect fieldName={field.name} options={field.options} values={this.props.values} />;
      case FieldType.FILE_FIELD:
        return <ImageInput className="form-control" {...field.props} field={field.name}/>;
      case FieldType.PASSWORD_FIELD:
        return <Text className="form-control" {...field.props} field={field.name} type="password" validate={field.validate}/>;
      case FieldType.SELECT_FIELD:
        return <CustomSelect field={field} />;
      default:
        return <Text className="form-control" {...field.props} field={field.name} validate={field.validate}/>;
    }
  };

  renderFields = () => {
    const { fields } = this.props;
    return fields.map((field, idx) => this.renderField(field, idx));
  };

  renderButtons = formState => {
    const { backPath, submitForm, isFetching } = this.props;

    return (
      <React.Fragment>
        <Link to={backPath} className="btn btn-primary mr-1">Back</Link>
        <Button onClick={() => submitForm(formState.values)} color="success" type="submit">
          {isFetching ? btnSpinner() : 'Save'}
        </Button>
      </React.Fragment>
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
      isFetching ? <div>Loading data...</div> : <Form initialValues={values} component={this.renderForm}/>
    );
  }
}

CommonForm.propTypes = {
  values: PropTypes.object.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  backPath: PropTypes.string.isRequired,
  submitForm: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default CommonForm;
