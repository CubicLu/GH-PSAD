import { FieldType } from 'components/helpers/form_fields'

const fields = (managers = [], admins = [], renderLocationModal) => (
  [
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

const filterFields = () => [
]

const exampleData = {
  'status': 'active'
}

export { fields, filterFields, exampleData };
