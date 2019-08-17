import faker from 'faker'
import { FieldType } from 'components/helpers/form_fields'

const fields = (officers, managers, townManagers) => [
  { name: 'email', label: 'Email *' },
  { name: 'name', label: 'Name *' },
  { name: 'phone', label: 'Phone' },
  { name: 'status', label: 'Status *', type: FieldType.SELECT_FIELD, options: [{value: 'active', label: 'Active'}, { value: 'suspended', label: 'Suspended' }], defaultValue: 'active' },
  { name: 'manager_id', label: 'Manager *', type: FieldType.SELECT_FIELD, emptyValue: 0, options: managers.map(manager => { return { value: manager.id, label: manager.email }})  },
  { name: 'town_manager_id', label: 'Town Manager *', type: FieldType.SELECT_FIELD, emptyValue: 0, options: townManagers.map(townManager => { return { value: townManager.id, label: townManager.email }}) },
  { name: 'officer_ids', label: 'Officers', type: FieldType.MULTISELECT_FIELD, options: officers.map(officer => { return { value: officer.id, label: officer.email }})  }
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
  { name: 'location.full_address', label: 'Full Address' }
];

const exampleData = () => process.env.NODE_ENV !== 'production' ? {
  'email': faker.internet.email(),
  'name': faker.company.companyName(),
  'phone': '+13583767678',
  'status': 'suspended'
} : {
  'status': 'suspended'
}

const filterFields = (roles) => [
  { name: 'name', label: 'Agency Name' },
  { name: 'email', label: 'Agency Email' },
  { name: 'phone', label: 'Agency Phone' },
  { name: 'full_address', label: 'Full Address' }
];

export { fields, showFields, exampleData, filterFields };
