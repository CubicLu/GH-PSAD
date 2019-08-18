import faker from 'faker'
import { FieldType } from 'components/helpers/form_fields'

const fields = (officers, managers, townManagers) => [
  { name: 'zip', label: 'Zip', mandatory: true },
  { name: 'building', label: 'Building', mandatory: true },
  { name: 'street', label: 'Street', mandatory: true },
  { name: 'city', label: 'City', mandatory: true },
  { name: 'country', label: 'Country', mandatory: true },
  { name: 'ltd', label: 'Latitude(ltd)', mandatory: true },
  { name: 'lng', label: 'Longitude(lng)', mandatory: true }
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
