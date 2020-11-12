import faker from 'faker'
import { FieldType } from 'components/helpers/form_fields'
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const fieldsNew = (officers, managers, townManagers, renderLocationModal) => [
  {
    name: 'location',
    label: 'Location',
    mandatory: true,
    render: renderLocationModal
  },
  { name: 'email', label: 'Email', mandatory: true },
  { name: 'name', label: 'Name', mandatory: true },
  { name: 'phone', label: 'Phone' },
  // TODO add condition to only show status field to system and super admin
  { name: 'status', label: 'Status', mandatory: true, type: FieldType.SELECT_FIELD, options: [{value: 'active', label: 'Active'}, { value: 'suspended', label: 'Suspended' }], defaultValue: 'active' },
  { name: 'manager_id', label: 'Manager', mandatory: true, type: FieldType.SELECT_FIELD, emptyValue: 0, options: managers.map(manager => { return { value: manager.value, label: manager.label }})  },
  { name: 'town_manager_id', label: 'Town Manager', mandatory: true, type: FieldType.SELECT_FIELD, emptyValue: 0, options: townManagers.map(townManager => { return { value: townManager.value, label: townManager.label }}) },
  { name: 'officer_ids', label: 'Officers', type: FieldType.MULTISELECT_FIELD, options: officers.map(officer => { return { value: officer.value, label: officer.label }})  }
];

const fieldsShow = (officers, managers, townManagers, renderLocationModal, userPermissions) => fieldsWithPermission(
  fieldsNew(officers, managers, townManagers, renderLocationModal),
  userPermissions,
  permissions.UPDATE_AGENCY
);

const exampleData = () => process.env.NODE_ENV !== 'production' ? {
  'email': faker.internet.email(),
  'name': faker.company.companyName(),
  'phone': '+13583767678',
  'status': 'active'
} : {
  'status': 'active'
}

const filterFields = (roles) => [
  { name: 'name', label: 'Agency Name' },
  { name: 'email', label: 'Agency Email' },
  { name: 'phone', label: 'Agency Phone' },
  { name: 'full_address', label: 'Full Address' }
];

export { fieldsNew, fieldsShow, exampleData, filterFields };
