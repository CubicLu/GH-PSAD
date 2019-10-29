import React from 'react';
import faker from 'faker'
import { FieldType } from 'components/helpers/form_fields'
import { Label } from 'reactstrap';
import { asField } from 'informed';

const LabelInput = asField(({ fieldState }) => {
  let { value } = fieldState;
  return <Label className="text-muted" sm={2}>{value}</Label>
});

const renderLabelInput = (field, props) => {
  return <LabelInput {...props} field={field.name} />;
}

const fieldsName = [
  'zip',
  'street',
  'state',
  'country',
  'building',
  'city',
  'ltd',
  'lng'
]

const fields = [
  { name: 'location.zip', label: 'Zip', mandatory: true },
  { name: 'location.street', label: 'Street', mandatory: true },
  { name: 'location.state', label: 'State', mandatory: true },
  { name: 'location.country', label: 'Country', mandatory: true },
  { name: 'location.building', label: 'Building', mandatory: true },
  { name: 'location.city', label: 'City', mandatory: true },
  { name: 'location.ltd', label: 'ltd', mandatory: true, type: FieldType.LABEL_TEXT_FIELD, render: renderLabelInput },
  { name: 'location.lng', label: 'lng', mandatory: true, type: FieldType.LABEL_TEXT_FIELD, render: renderLabelInput },
];

const exampleData = () => process.env.NODE_ENV !== 'production' ? {
  'zip': faker.address.zipCode(),
  'building': 'A12',
  'street': faker.address.streetName(),
  'city': faker.address.city(),
  'country': faker.address.country(),
  'full_address': ''
} : {
  'full_address': ''
}



export { fields, exampleData, fieldsName };
