import React from 'react';
import { Card, CardBody, CardHeader, Row } from 'reactstrap';
import { fields } from 'components/helpers/fields/agencies/location';
import { Form } from 'informed';
import { renderFieldsWithGrid } from 'components/base/forms/common_form';

class New extends React.Component {
  render () {
    const { record, isSaving, setFormApi } = this.props;
    return (
      <Card>
        <CardHeader>
          Agency Location
        </CardHeader>
        <CardBody>
          <fieldset disabled={isSaving}>
            <Form getApi={setFormApi} initialValues={record.location} >
              {renderFieldsWithGrid(fields(), 2, 6, fieldProps)}
            </Form>
          </fieldset>
        </CardBody>
      </Card>
    );
  }
}

const fieldProps = { lSize: 6 };

export default New;
