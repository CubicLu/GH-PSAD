import React from 'react';
import { Scope, Text, ArrayField } from 'informed';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { fields as fieldsNearbyPlaces } from 'components/helpers/fields/parking/nearby_places';
import { renderFields } from 'components/base/forms/common_form';

const PlacesList = (props) => (
  <ArrayField field="places">
    {({ add, fields }) => (
      <React.Fragment>
        {fields.map((dataField, i) => (
          <Place {...dataField} key={i} errors={props.errors} categoriesDropdown={props.categoriesDropdown} events={props.events} />
        ))}
        <Button className="float-right" onClick={() => {
            if (fields.length <= limit) {
              add()
            }
          }}>
          + Add Place
        </Button>
      </React.Fragment>
    )}
  </ArrayField>
)

const Place = ({ field, remove, ...props}) => (
  <Scope scope={field} >
    <div>
      <Button onClick={() => {
        props.events.onChange() // To show 'save changes' button
        remove()
      }} className='float-right'>
        <FontAwesomeIcon icon={faTimes}/>
      </Button>
      <Text field="id" hidden/>
      { renderFields(fieldsNearbyPlaces(props.categoriesDropdown), props) }
      <hr/>
      <div className="mt-4"/>
    </div>
  </Scope>
)

const limit = 20

export default PlacesList;