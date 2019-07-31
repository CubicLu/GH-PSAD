import * as FieldType from 'components/base/common_form/field_types';

const fields = (roles) => [
  { name: 'email', label: 'Email *' },
  { name: 'username', label: 'Username *' },
  { name: 'phone', label: 'Phone *' },
  {
    name: 'status',
    label: 'Status *',
    type: FieldType.SELECT_FIELD,
    options: [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]
  },
  {
    name: 'role_id',
    label: 'Role *',
    type: FieldType.SELECT_FIELD,
    options: roles.map(({value, label}) => {
      return { value, label };
    })
  },
  { name: 'name', label: 'Name' },
];


const showFields = () => [
  { name: 'email', label: 'Email' },
  { name: 'username', label: 'Username' },
  { name: 'phone', label: 'Phone' },
  { name: 'status', label: 'Status', },
  { name: 'role.name', label: 'Role' },
  { name: 'name', label: 'Name' },
];


const filterFields = (roles) => [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
  { name: 'username', label: 'Username' },
  {
    name: 'status',
    label: 'Status',
    type: FieldType.SELECT_FIELD,
    options: [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]
  },
  {
    name: 'role_names',
    label: 'Role',
    type: FieldType.MULTISELECT_FIELD,
    options: roles.map(({value, label}) => {
      return { value, label };
    })
  },
];


export { fields, showFields, filterFields };
