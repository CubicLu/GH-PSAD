import React from 'react';
import { Scope, Text, ArrayField } from 'informed';
import { fields as fieldsNearbyPlaces } from 'components/helpers/fields/parking/nearby_places';
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
import { ReactComponent as TrashIcon } from 'assets/trash_icon.svg';
import Button from 'components/base/button';
import styles from './nearby_places.module.sass';

const PlacesList = (props) => (
  <ArrayField field="places">
    {({ add, fields }) => (
      <React.Fragment>
        {fields.map((dataField, i) => (
          <Place {...dataField} key={i} errors={props.errors} categoriesDropdown={props.categoriesDropdown} events={props.events} disabled={props.disabled} />
        ))}
        {!props.disabled &&
          <Button
            className="float-right"
            status="primary-outline"
            onClick={() => { fields.length <= limit && add(); }}
          >
            +Add Place
          </Button>
        }
      </React.Fragment>
    )}
  </ArrayField>
)

const Place = ({ field, remove, disabled, ...props}) => (
  <Scope scope={field} >
    <div>
      <Text field="id" hidden/>
      <div className="d-flex">
        <div className="flex-grow-1">
          { renderFieldsWithGrid(fieldsNearbyPlaces(props.categoriesDropdown), 2, 6, { ...props, iSize: 8, lSize: 4 }) }
        </div>
        {!disabled &&
          <Button
            onClick={() => {
              props.events.onChange(); // To show 'save changes' button
              remove();
            }}
            status="danger-outline"
            icon={<TrashIcon />}
            className={styles.btnDelete}
            size="md"
          />
        }
      </div>
      <hr/>
      <div className="mt-4"/>
    </div>
  </Scope>
)

const limit = 20

export default PlacesList;