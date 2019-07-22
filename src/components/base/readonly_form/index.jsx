import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Form, FormGroup, Input, Label } from 'reactstrap';
import { labelFor } from 'components/helpers/forms';
import { isFunction } from 'underscore';

class ReadonlyForm extends React.Component {
  renderField = (field, key) => (
    <FormGroup row key={key}>
      <Label for={field.name} sm={2}>{labelFor(field)}</Label>
      <Col sm={10}>
        {this.renderOutput(field)}
      </Col>
    </FormGroup>
  );

  renderOutput = field => {
    if (isFunction(field.render)) {
      return field.render(field);
    }

    return (<Input id={field.name} plaintext readOnly value={this.getValue(field)}/>);
  };

  getValue = field => {
    const { values } = this.props;
    return values[field.name];
  };

  renderFields = () => {
    const { fields } = this.props;

    return fields.map((field, idx) => this.renderField(field, idx));
  };

  renderButtons = () => {
    const { backPath, match } = this.props;

    return (
      <React.Fragment>
        <Link to={backPath} className="btn btn-primary mr-1">Back</Link>
        <Link to={`${match.url}/edit`} className="btn btn-primary">Edit</Link>
      </React.Fragment>
    );
  };

  render() {
    return (
      <Form>
        {this.renderFields()}
        {this.renderButtons()}
      </Form>
    );
  }
}

export default ReadonlyForm;
