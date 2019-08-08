import React from 'react';
import { Card, CardBody, CardHeader, Row } from 'reactstrap';
import { fields } from 'components/helpers/fields/parking/settings';
import { Form } from 'informed';
import { renderFieldsWithGrid } from 'components/base/form';

class Edit extends React.Component {
  render () {
    const { record, isSaving, setFormApi } = this.props;

    return (
      <Card>
        <CardHeader>
          Parking Lot Parameters
        </CardHeader>
        <CardBody>
          <fieldset disabled={isSaving}>
            <Form getApi={setFormApi} initialValues={record} >
              {renderFieldsWithGrid(fields, 2, 6, fieldProps)}
            </Form>
          </fieldset>
        </CardBody>
      </Card>
    );
  }
}

const fieldProps = { lSize: 6 };

export default Edit;
