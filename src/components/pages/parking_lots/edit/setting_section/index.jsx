import React from 'react';
import PropTypes from 'prop-types';
import { fields } from 'components/helpers/fields/parking/settings';
import { Form } from 'informed';
import { renderFieldsWithGrid, renderFormErrors } from 'components/base/forms/common_form';
import CollapsableCard from 'components/base/collapsable_card';

const fieldProps = { lSize: 6 };

const renderForm = props => {
  const { record, isSaving, setFormApi } = props;

  return (
    <fieldset disabled={isSaving}>
      <Form getApi={setFormApi} initialValues={record} >
        {({ formState }) => (
          <React.Fragment>
            {renderFormErrors(formState, fields)}
            {renderFieldsWithGrid(fields, 2, 6, fieldProps)}
          </React.Fragment>
        )}
      </Form>
    </fieldset>
  );
};

const SettingSection = props => (
  <CollapsableCard header="Parking Lot Parameters" body={renderForm(props)}/>
);

SettingSection.propTypes = {
  record: PropTypes.object,
  isSaving: PropTypes.bool.isRequired,
  setFormApi: PropTypes.func.isRequired
};

renderForm.propTypes = {
  record: PropTypes.object,
  isSaving: PropTypes.bool.isRequired,
  setFormApi: PropTypes.func.isRequired
};

export default SettingSection;
