import faker from 'faker'
import * as FieldType from 'components/base/common_form/field_types';

const fields = (officers, managers, town_managers) => [
  { name: 'avatar', label: 'Image', type: FieldType.FILE_FIELD},
  { name: 'email', label: 'Email *' },
  { name: 'name', label: 'Name *' },
  { name: 'phone', label: 'Phone' },
  { name: 'status', label: 'Status *', type: FieldType.SELECT_FIELD, options: [{value: 'active', label: 'Active'}, { value: 'suspended', label: 'Suspended'}], defaultValue: 'active' },
  { name: 'manager_id', label: 'Manager *', type: FieldType.SELECT_FIELD, options: managers.map(manager => { return {value: manager.id, label: manager.email}})  },
  { name: 'town_manager_id', label: 'Town Manager *', type: FieldType.SELECT_FIELD, options: town_managers.map(town_manager => { return {value: town_manager.id, label: town_manager.email}})  },
  { name: 'officer_ids', label: 'Officers', type: FieldType.MULTISELECT_FIELD, options: officers.map(officer => { return {value: officer.id, label: officer.email}})  },
  { name: 'location.zip', label: 'Zip *', divider: { title: 'Location' } },
  { name: 'location.building', label: 'Building *' },
  { name: 'location.street', label: 'Street *' },
  { name: 'location.city', label: 'City *' },
  { name: 'location.country', label: 'Country *' },
  { name: 'location.ltd', label: 'Latitude(ltd) *' },
  { name: 'location.lng', label: 'Longitude(lng) *' }
];

const showFields = () => [
  { name: 'avatar', label: 'Image', type: FieldType.FILE_FIELD},
  { name: 'email', label: 'Email' },
  { name: 'name', label: 'Name' },
  { name: 'phone', label: 'Phone' },
  { name: 'status', label: 'Status', },
  { name: 'manager.name', label: 'Manager' },
  { name: 'town_manager.name', label: 'Town Manager', },
  { name: 'officers', label: 'Officers', type: FieldType.MULTISELECT_FIELD, innerLabel: 'name' },
  { name: 'location.full_address', label: 'Full Address' },
];


const exampleData = process.env.NODE_ENV !== 'production' ? {
  'email': faker.internet.email(),
  'name': 'My Best Agency',
  'phone': '+13583767678',
  'status': 'suspended',
  'location.zip': faker.address.zipCode(),
  'location.building': 'A12',
  'location.street': faker.address.streetName(),
  'location.city': faker.address.city(),
  'location.country': faker.address.country(),
  'location.ltd': faker.address.latitude(),
  'location.lng': faker.address.longitude()
} : {
  'status': 'suspended'
}


export { fields, showFields, exampleData };
