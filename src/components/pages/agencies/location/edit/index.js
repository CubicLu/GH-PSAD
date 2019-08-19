import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { Form } from 'informed';
/* Actions */
/* API */
/* Base */
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
/* Helpers */
import { fields } from 'components/helpers/fields/agencies/location';
/* Modules */

class Edit extends React.Component {
  render () {
    const { record, isSaving, setFormApi } = this.props;
    return (
      <Card>
        <CardHeader>
          {record.name} Location
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

export default Edit;
