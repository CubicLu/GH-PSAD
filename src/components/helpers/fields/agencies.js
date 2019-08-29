import faker from 'faker'
import { FieldType } from 'components/helpers/form_fields'

const fields = (officers, managers, townManagers) => [
  { name: 'email', label: 'Email', mandatory: true },
  { name: 'name', label: 'Name', mandatory: true },
  { name: 'phone', label: 'Phone' },
  // TODO add condition to only show status field to system and super admin
  { name: 'status', label: 'Status', mandatory: true, type: FieldType.SELECT_FIELD, options: [{value: 'active', label: 'Active'}, { value: 'suspended', label: 'Suspended' }], defaultValue: 'active' },
  { name: 'manager_id', label: 'Manager', mandatory: true, type: FieldType.SELECT_FIELD, emptyValue: 0, options: managers.map(manager => { return { value: manager.id, label: manager.email }})  },
  { name: 'town_manager_id', label: 'Town Manager', mandatory: true, type: FieldType.SELECT_FIELD, emptyValue: 0, options: townManagers.map(townManager => { return { value: townManager.id, label: townManager.email }}) },
  { name: 'officer_ids', label: 'Officers', type: FieldType.MULTISELECT_FIELD, options: officers.map(officer => { return { value: officer.id, label: officer.email }})  }
];

const exampleData = () => process.env.NODE_ENV !== 'production' ? {
  'email': faker.internet.email(),
  'name': faker.company.companyName(),
  'phone': '+13583767678',
  'status': 'active'
} : {
  'status': 'active'
}

const exampleLocationData = () => process.env.NODE_ENV !== 'production' ? {
  'zip': faker.address.zipCode(),
  'building': 'A12',
  'street': faker.address.streetName(),
  'city': faker.address.city(),
  'country': faker.address.country(),
  'ltd': faker.address.latitude(),
  'lng': faker.address.longitude()
} : {}

const filterFields = (roles) => [
  { name: 'name', label: 'Agency Name' },
  { name: 'email', label: 'Agency Email' },
  { name: 'phone', label: 'Agency Phone' },
  { name: 'full_address', label: 'Full Address' }
];

export { fields, exampleData, exampleLocationData, filterFields };
