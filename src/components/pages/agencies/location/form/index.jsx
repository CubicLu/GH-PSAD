import React, { useState } from 'react';
import { withFormApi } from 'informed';
import ModalForm from 'components/helpers/modals/form';
import { InputGroup } from 'reactstrap';
import { ReactComponent as LocationIcon } from 'assets/location_icon.svg'
import styles from './location.module.sass'
import { cloneDeep } from 'lodash'
/* Actions */
/* API */
/* Base */
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
/* Helpers */
import { fields } from 'components/helpers/fields/location';
import { FieldType } from 'components/helpers/form_fields';
/* Modules */

const LocationForm = (props) => {
  const { currentLocation, setCurrentLocation, formApi } = props
  const [ isOpen, setIsOpen] = useState(false)
  const [ isSaved, setIsSaved] = useState(null)
  const [ showSaveButton, setShowSaveButton] = useState(null)

  const googleMapEvents = {
    onMapClick: (locationRequest) => {
      formApi.setValues({location: locationRequest})
      setShowSaveButton(true)
    }
  }

  const events = {
    onChange: () => setShowSaveButton(true)
  }

  const onClickSave = () => {
    const values = formApi.getValue('location')
    values.full_address = formatFullAddress(values)

    fields.forEach(field => {
        // location fields name has a location.field pattern
        // Example: location.street
        const name = field.name.split('.')[1]
        if(!values[name]) {
          values[name] = ''
        }
    });

    setCurrentLocation(cloneDeep(values))
    setIsSaved(true)
    setIsOpen(false)
  }

  const onModalClose = () => {
    if (!isSaved) {
      formApi.setValues({location: currentLocation})
    }
  }

  const onOpened = () => {
    if (formApi) {
      formApi.setValues({location: currentLocation})
    }
  }

  return (
    <React.Fragment>
      <ModalForm
        title="Add Location"
        showSaveButton={showSaveButton}
        onClosed={onModalClose}
        onOpened={onOpened}
        toggleModal={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        onClickSave={onClickSave}
      >
        { renderFieldsWithGrid(fields, 2, 6, { lSize: 6, events }) }
        {
          renderFieldsWithGrid([
            {
              type: FieldType.GOOGLE_MAPS_FIELD,
              options: {
                markerName: 'Your agency location',
                ltd: currentLocation.ltd || defaultCenter.ltd,
                lng: currentLocation.lng || defaultCenter.lng
              }
            }], 2, 12, { iSize: 12, events: googleMapEvents })
          }
      </ModalForm>
       <InputGroup>
        <input readOnly value={currentLocation.full_address} className="pr-4 bg-white form-control" onClick={() => setIsOpen(true)} />
        <LocationIcon className={styles.LocationIcon} />
      </InputGroup>
    </React.Fragment>
  );
}

const formatFullAddress = (address) => {
  return ['street', 'building', 'city', 'country', 'zip'].map(key => {
    return address[key]
  }).filter(Boolean).join(', ')
}

const defaultCenter = {
    ltd: 38.77,
    lng: -76.07
} // Easton, USA coordinates

export default withFormApi(LocationForm);
