import faker from 'faker'
import { FieldType } from 'components/helpers/form_fields'
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const fieldsNew = (roles) => [
  { name: 'name', label: 'Full name', mandatory: true },
  { name: 'email', label: 'Email', mandatory: true },
  { name: 'username', label: 'User name', mandatory: true },
  {
    name: 'role_id',
    label: 'Role',
    mandatory: true,
    type: FieldType.SELECT_FIELD,
    options: roles.map(({ value, label }) => {
      const disabled = label === 'super_admin' || label === 'system_admin'
      return { value, label, disabled };
    })
  },
  { name: 'phone', label: 'Phone' },
  {
    name: 'status',
    label: 'Current status',
    mandatory: true,
    type: FieldType.SELECT_FIELD,
    options: [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]
  }
];

const fieldsShow = (roles, userPermissions) => fieldsWithPermission(
  fieldsNew(roles),
  userPermissions,
  permissions.UPDATE_ADMIN
);

const filterFields = (roles) => [
  { name: 'name', label: 'Name' },
  {
    name: 'role_names',
    label: 'Role',
    type: FieldType.MULTISELECT_FIELD,
    options: roles.map(({ value, label }) => {
      return { value, label };
    })
  },
  {
    name: 'status',
    label: 'Status',
    type: FieldType.SELECT_FIELD,
    options: [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]
  },
];

const exampleData = (roles) => process.env.NODE_ENV !== 'production' ? {
  email: faker.internet.email(),
  username: faker.internet.userName(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  phone: '+13583767678',
  status: 'suspended',
  role_id: roles ? roles.value : ''
} : {
    status: 'suspended'
  } // These are defaults values for each field

export { fieldsNew, fieldsShow, exampleData, filterFields };
