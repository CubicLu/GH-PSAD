import React from 'react';
import { Form, Text, withFormState } from 'informed';
import { Button, Col, FormGroup, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { btnSpinner } from 'components/helpers';

class CommonForm extends React.Component {
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
      case 'select':
        return (
          <Input type="select" name={field.name} >
            {field.options.map(option => {
              return <option value={option.value}>{option.label}</option>
            })}
          </Input>
        )
        break;
      case 'something else':
        break;
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
        <Button onClick={() => submitForm(formState)} color="success" type="submit">
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

  render() {
    const { values, isFetching } = this.props;

    return (
      <fieldset disabled={isFetching}>
        <Form initialValues={values} component={this.renderForm}/>
      </fieldset>
    );
  }
}

export default CommonForm;
