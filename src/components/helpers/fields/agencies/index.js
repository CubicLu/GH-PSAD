import faker from 'faker'
import generateNameFields from '../generate_name_fields'
import * as FieldType from 'components/base/common_form/field_types';

const baseModel = 'agency'

const fields = (officers, managers, town_managers) => generateNameFields(baseModel, [
  { name: '[avatar]', label: 'Image', type: FieldType.FILE_FIELD},
  { name: '[email]', label: 'Email *' },
  { name: '[name]', label: 'Name *' },
  { name: '[phone]', label: 'Phone' },
  { name: '[status]', label: 'Status *', type: FieldType.SELECT_FIELD, options: [{value: 'active', label: 'Active'}, { value: 'suspended', label: 'Suspended'}], defaultValue: 'active' },
  { name: '[manager_id]', label: 'Manager *', type: FieldType.SELECT_FIELD, options: managers.map(manager => { return {value: manager.id, label: manager.email}})  },
  { name: '[town_manager_id]', label: 'Town Manager *', type: FieldType.SELECT_FIELD, options: town_managers.map(town_manager => { return {value: town_manager.id, label: town_manager.email}})  },
  { name: '[officer_ids]', label: 'Officers', type: FieldType.MULTISELECT_FIELD, options: officers.map(officer => { return {value: officer.id, label: officer.email}})  },
  { name: '[location][zip]', label: 'Zip *', divider: { title: 'Location' } },
  { name: '[location][building]', label: 'Building *' },
  { name: '[location][street]', label: 'Street *' },
  { name: '[location][city]', label: 'City *' },
  { name: '[location][country]', label: 'Country *' },
  { name: '[location][ltd]', label: 'Latitude(ltd) *' },
  { name: '[location][lng]', label: 'Longitude(lng) *' }
]);

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
  [`${baseModel}[email]`]: faker.internet.email(),
  [`${baseModel}[name]`]: 'My Best Agency',
  [`${baseModel}[phone]`]: '+13583767678',
  [`${baseModel}[location][zip]`]: faker.address.zipCode(),
  [`${baseModel}[location][building]`]: 'A12',
  [`${baseModel}[location][street]`]: faker.address.streetName(),
  [`${baseModel}[location][city]`]: faker.address.city(),
  [`${baseModel}[location][country]`]: faker.address.country(),
  [`${baseModel}[location][ltd]`]: faker.address.latitude(),
  [`${baseModel}[location][lng]`]: faker.address.longitude()
} : {}


export { fields, showFields, exampleData };
