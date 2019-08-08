import faker from 'faker'
import * as FieldType from 'components/base/form/field_types';

const fields = (roles) => [
  { name: 'username', label: 'Username *' },
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email *' },
  { name: 'phone', label: 'Phone' },
  {
    name: 'role_id',
    label: 'Role *',
    type: FieldType.SELECT_FIELD,
    options: roles.map(({value, label}) => {
      const disabled = label === 'super_admin' || label === 'system_admin'
      return { value, label, disabled };
    })
  },
  { name: 'avatar', label: 'Profile Picture', type: FieldType.FILE_FIELD, },
  {
    name: 'status',
    label: 'Status *',
    type: FieldType.SELECT_FIELD,
    options: [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]
  },

];

const showFields = () => [
  { name: 'username', label: 'Username' },
  { name: 'avatar', label: 'Profile Picture', type: FieldType.FILE_FIELD },
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
  { name: 'phone', label: 'Phone' },
  { name: 'id', label: 'ID' },
  { name: 'role.name', label: 'Role' },
  { name: 'status', label: 'Status', },
];


const exampleData = process.env.NODE_ENV !== 'production' ? {
  email: faker.internet.email(),
  username: faker.internet.userName(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  phone: '+13583767678',
  status: 'suspended'
} : {
  status: 'suspended'
} // These are defaults values for each field

export { fields, showFields, exampleData };
