import { FieldType } from 'components/helpers/form_fields'

const fields = (officers, statuses) => [
  {
    name: 'status',
    label: 'Current Status',
    mandatory: true,
    type: FieldType.SELECT_FIELD,
    options: statuses.map(({label, value}) => {
      return { value, label};
    })
  },
  {
    name: 'reason',
    label: 'Reason for status',
     mandatory: true
  },
  {
    name: 'admin_id',
    mandatory: true,
    label: 'Officer handled',
    type: FieldType.SELECT_FIELD,
    options: officers.map(officer => { return {value: officer.value, label: officer.label}})
  }
]

const filterFields = (officers, statuses, types) => [
  { name: 'ticket_id', label: 'Ticket ID'},
  {
    name: 'type',
    label: 'Violation Name',
    type: FieldType.SELECT_FIELD,
    options: types.map(({label, value}) => {
      return { value, label };
    })
  },
  { name: 'query', label: 'Parking Lot Name'},
  {
    name: 'range',
    type: FieldType.DATE_FIELD,
    label: 'Range Date'
  },
  {
    name: 'admin_ids',
    label: 'Officers',
    type: FieldType.MULTISELECT_FIELD,
    options: officers.map(({label, value}) => {
      return { value, label };
    })
  },
  {
    name: 'status',
    label: 'Ticke Status',
    type: FieldType.SELECT_FIELD,
    options: statuses.map(({label, value}) => {
      return { value, label};
    })
  }
]

export { fields, filterFields };
