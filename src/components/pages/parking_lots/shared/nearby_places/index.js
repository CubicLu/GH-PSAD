import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';
import PlacesList from './places_list'
/* Actions */
/* API */
/* Base */
import CollapsableCard from 'components/base/collapsable_card';
/* Helpers */
/* Module */

const NearbyPlacesForm = props => {
  const { records, isSaving, setFormApi, setInputChanged, categoriesDropdown, errors } = props;
  const events = {
    onChange: () => setInputChanged()
  }

  return (
    <fieldset disabled={isSaving}>
      <Form getApi={setFormApi} initialValues={{places: records}} >
        {({ formState, formApi }) => (
          <PlacesList errors={errors} categoriesDropdown={categoriesDropdown || []} events={events}/>
        )}
      </Form>
    </fieldset>
  );
};

const NearbyPlaces = props => (
  <CollapsableCard header="Nearby places" >
    <NearbyPlacesForm {...props}/>
  </CollapsableCard>
);

NearbyPlaces.propTypes = {
  record: PropTypes.object,
  isSaving: PropTypes.bool.isRequired,
  setFormApi: PropTypes.func.isRequired
};

NearbyPlacesForm.propTypes = {
  record: PropTypes.object,
  isSaving: PropTypes.bool.isRequired,
  setFormApi: PropTypes.func.isRequired
};

export default NearbyPlaces;
