import React from 'react';
import CommonForm from 'components/base/common_form';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import { labelFor } from 'components/helpers/forms';

class HorizontalForm extends CommonForm {
  renderField = (field, key) => (
    <FormGroup row key={key}>
      <Label for={field.name} md={6}>{labelFor(field)}</Label>
      <Col md={6}>
        {this.renderInput(field)}
      </Col>
    </FormGroup>
  );

  renderFields = () => {
    const { fields } = this.props;
    const rows = 4;
    let output = [];
    let start = 0;
    while (start <= fields.length) {
      output.push(
        (<Col key={start} md={4}>
          {fields.slice(start, start + rows).map((field, idx) => this.renderField(field, idx))}
        </Col>)
      );
      start += rows;
    }
    return (<Row>{output}</Row>);
  };
}


export default HorizontalForm;
