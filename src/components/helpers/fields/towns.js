import { FieldType } from 'components/helpers/form_fields'

const filterFields = (townManagers) => [
  { name: 'id', label: 'Parking Lot ID' },
  { name: 'name', label: 'Parking Lot Name' },
  { name: 'phone', label: 'Contact Number ' },
  { name: 'email', label: 'Email Address' },
  {
    name: 'town_managers',
    label: 'Town Manager',
    type: FieldType.SELECT_FIELD,
    options: townManagers.map(({ value, label }) => {
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


export { filterFields };
