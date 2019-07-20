import React from 'react';
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import { Link } from 'react-router-dom';
import * as FieldType from './field_types';
import _ from 'lodash'

class CommonShowForm extends React.Component {

  renderField = (field, key) => (
    <FormGroup row key={key}>
      <Label for={field.name} sm={2}>{field.label}</Label>
      <Col sm={10}>
        {this.renderInput(field)}
      </Col>
    </FormGroup>
  );

  listField = (list, innerLabel) => (<ListGroup>
        {
          list.map((element, index) => <ListGroupItem key={`${element[innerLabel]}${index}`}> #{index+1}: {element[innerLabel]}</ListGroupItem>)
        }
      </ListGroup>
  )

  renderInput = field => {
    const { values } = this.props
    const value = _.get(values, field.name) || ''
    switch (field.type) {
      case FieldType.MULTISELECT_FIELD:
        return this.listField(value, field.innerLabel)
      case FieldType.FILE_FIELD:
        return <img src={value} alt={field.name}/>
      default:
        return <Input id={field.name} plaintext readOnly value={value}/>
    }
  };

  renderFields = () => {
    const { fields } = this.props;
    return fields.map((field, idx) => this.renderField(field, idx));
  };

  renderButtons = formState => {
    const { backPath, editURL } = this.props;

    return (
      <React.Fragment>
        <Link to={backPath} className="btn btn-primary mr-1">Back</Link>
        <Link to={`${editURL}/edit`} className="btn btn-primary">Edit</Link>
      </React.Fragment>
    );
  };

  renderForm = () => (
    <React.Fragment>
      {this.renderFields()}
      {this.renderButtons()}
    </React.Fragment>
  );

  render() {
    return <Form> {this.renderForm()} </Form>
  }
}

export default CommonShowForm;
