import { FieldType } from 'components/helpers/form_fields'

const fields = (officers, statuses) => [
  { name: 'admin_id', label: 'Officer handled *', type: FieldType.SELECT_FIELD,  options: officers.map(officer => { return {value: officer.id, label: officer.email}})  },
  { name: 'status', label: 'Current Status *', type: FieldType.SELECT_FIELD,  options: statuses.map(status => { return {value: status, label: status}})   },
]

const showFields = (officers, statuses) => [
  { name: 'admin', label: 'Officer'},
  { name: 'status', label: 'Status'},
  { name: 'type', label: 'Status'},
  { name: 'agency.name', label: 'Agency Name'},
  { name: 'agency.id', label: 'Agency ID'},
  { name: 'agency.email', label: 'Agency Email'},
  { name: 'agency.phone', label: 'Agency Phone'},
  { name: 'officer.name', label: 'Officer Name'},
  { name: 'officer.email', label: 'Officer Email'}
];

const filterFields = (officers, statuses) => [
  { name: 'ticket_id', label: 'Ticket ID'},
  { name: 'type', label: 'Violation Name'},
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
    options: statuses.map((value) => {
      return { value, label: value };
    })
  }
]

export { fields, showFields, filterFields };
