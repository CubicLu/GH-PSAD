import React from 'react';
import PropTypes from 'prop-types';
import { fields } from 'components/helpers/fields/parking/settings';
import { Form } from 'informed';
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
import CollapsableCard from 'components/base/collapsable_card';

const FormSetting = props => {
  const { record, isSaving, setFormApi, fieldProps } = props;

  return (
    <fieldset disabled={isSaving}>
      <Form getApi={setFormApi} initialValues={record} >
        {({ formState }) => (
          <React.Fragment>
            {renderFieldsWithGrid(fields, 2, 6, {...fieldProps, formState, iSize: 6, lSize: 6 })}
          </React.Fragment>
        )}
      </Form>
    </fieldset>
  );
};

const SettingSection = props => (
  <CollapsableCard header="Parking Lot Settings">
    <FormSetting {...props}/>
  </CollapsableCard>
);

SettingSection.propTypes = {
  record: PropTypes.object,
  isSaving: PropTypes.bool.isRequired,
  setFormApi: PropTypes.func.isRequired
};

FormSetting.propTypes = {
  record: PropTypes.object,
  isSaving: PropTypes.bool.isRequired,
  setFormApi: PropTypes.func.isRequired
};

export default SettingSection;
