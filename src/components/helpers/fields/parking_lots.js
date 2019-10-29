import faker from 'faker'
import { FieldType } from 'components/helpers/form_fields'

const fieldsNew = (managers = [], admins = [], renderLocationModal) => (
  [
    {
      name: 'location',
      label: 'Location',
      mandatory: true,
      render: renderLocationModal
    },
    { name: 'name', label: 'Name', mandatory: true },
    { name: 'phone', label: 'Contact' },
    { name: 'parking_admin_id', label: 'Parking Admin', type: 'select', options: admins.map(admin => { return {value: admin.id, label: admin.email}}) },
    { name: 'email', label: 'Email' },
    { name: 'town_manager_id', label: 'Town Manager', mandatory: true, type: 'select', options: managers.map(manager => { return {value: manager.id, label: manager.email}}) },
    { name: 'status', label: 'Status', mandatory: true, type: FieldType.SELECT_FIELD, options: [{value: 'active', label: 'Active'}, { value: 'suspended', label: 'Suspended' }], defaultValue: 'active' }
  ]
);

const fieldsShow = (managers = [], admins = [], renderLocationModal) => [
     {
      name: 'disputes_count',
      type: FieldType.TEXT_LINK_FIELD,
      props: { to: '/disputes', value: 'Show list' },
      style: { maxWidth: 'inherit', display: 'inline' },
      label: 'Disputes received'
    },
    {
      name: 'violations_count',
      type: FieldType.TEXT_LINK_FIELD,
      props: { to: '/violations', value: 'Show list' },
      style: { maxWidth: 'inherit', display: 'inline' },
      label: 'Violation records'
    },
    ...fieldsNew(managers, admins, renderLocationModal)
]

const filterFields = (parkingAdmins, townManagers) => [
  { name: 'id', label: 'Parking Lot ID' },
  { name: 'name', label: 'Parking Lot Name' },
  { name: 'full_address', label: 'Location' },
  { name: 'phone', label: 'Contact Number ' },
  { name: 'email', label: 'Email Address' },
  {
    name: 'parking_admins',
    label: 'Assigned Parking Admin',
    type: FieldType.SELECT_FIELD  ,
    options: parkingAdmins.map(({value, label}) => {
      return { value, label };
    })
  },
  {
    name: 'town_managers',
    label: 'Assigned Town Manager',
    type: FieldType.SELECT_FIELD,
    options: townManagers.map(({value, label}) => {
      return { value, label };
    })
  },
  {
    name: 'status',
    label: 'Status',
    type: FieldType.SELECT_FIELD,
    options: [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]
  }
]

const exampleData = (roles) => process.env.NODE_ENV !== 'production' ? {
  name: 'Parking Lot test',
  phone: '+13583767678',
  email: faker.internet.email(),
  status: 'active'
} : {
  status: 'active'
} // These are defaults values for each field

export { fieldsNew, fieldsShow, filterFields, exampleData };
