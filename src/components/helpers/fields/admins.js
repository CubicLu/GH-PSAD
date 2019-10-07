import faker from 'faker'
import { FieldType } from 'components/helpers/form_fields'

const fields = (roles) => [
  { name: 'name', label: 'Name', mandatory: true },
  { name: 'email', label: 'Email', mandatory: true },
  { name: 'username', label: 'Username', mandatory: true },
  {
    name: 'role_id',
    label: 'Role',
    mandatory: true,
    type: FieldType.SELECT_FIELD,
    options: roles.map(({value, label}) => {
      const disabled = label === 'super_admin' || label === 'system_admin'
      return { value, label, disabled };
    })
  },
  { name: 'phone', label: 'Phone' },
  {
    name: 'status',
    label: 'Status',
    mandatory: true,
    type: FieldType.SELECT_FIELD,
    options: [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]
  }
];

const filterFields = (roles) => [
  { name: 'username', label: 'Username' },
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
  {
    name: 'role_names',
    label: 'Role',
    type: FieldType.MULTISELECT_FIELD,
    options: roles.map(({value, label}) => {
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

export { fields, exampleData, filterFields };
