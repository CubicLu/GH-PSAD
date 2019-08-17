import faker from 'faker'
import { FieldType } from 'components/helpers/form_fields'

const fields = (officers, managers, townManagers) => [
  { name: 'zip', label: 'Zip *' },
  { name: 'building', label: 'Building *' },
  { name: 'street', label: 'Street *' },
  { name: 'city', label: 'City *' },
  { name: 'country', label: 'Country *' },
  { name: 'ltd', label: 'Latitude(ltd) *' },
  { name: 'lng', label: 'Longitude(lng) *' }
];

const exampleData = () => process.env.NODE_ENV !== 'production' ? {
  'zip': faker.address.zipCode(),
  'building': 'A12',
  'street': faker.address.streetName(),
  'city': faker.address.city(),
  'country': faker.address.country(),
  'ltd': faker.address.latitude(),
  'lng': faker.address.longitude()
} : { }



export { fields, exampleData };
