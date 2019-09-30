import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';
import PlacesList from './places_list'
/* Actions */
/* API */
/* Base */
import { renderFormErrors } from 'components/base/forms/common_form';
import CollapsableCard from 'components/base/collapsable_card';
/* Helpers */
import { fields as fieldsNearbyPlaces } from 'components/helpers/fields/parking/nearby_places';
/* Module */

const NearbyPlacesForm = props => {
  const { records, isSaving, setFormApi, setInputChanged, categoriesDropdown } = props;
  const events = {
    onChange: () => setInputChanged()
  }

  return (
    <fieldset disabled={isSaving}>
      <Form getApi={setFormApi} initialValues={{places: records}} >
        {({ formState, formApi }) => (
            <React.Fragment>
              {renderFormErrors(formState, fieldsNearbyPlaces(categoriesDropdown || []))}
              <PlacesList categoriesDropdown={categoriesDropdown || []} events={events}/>
            </React.Fragment>
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
