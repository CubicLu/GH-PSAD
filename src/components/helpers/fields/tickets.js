import { FieldType } from 'components/helpers/form_fields'

const fields = (officers, statuses) => [
  { name: 'admin_id', label: 'Officer *', type: FieldType.SELECT_FIELD,  options: officers.map(officer => { return {value: officer.id, label: officer.email}})  },
  { name: 'status', label: 'Status *', type: FieldType.SELECT_FIELD,  options: statuses.map(status => { return {value: status, label: status}})   },
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
]

const filterFields = (officers, statuses) => [
  { name: 'tickets_id', label: 'Ticket ID'},
  { name: 'admins_email', label: 'Officer email'},
  { name: 'parking_lot_name', label: 'Parking Lot'},
  { name: 'tickets_status', label: 'Ticket Status'},
  { name: 'tickets_type', label: 'Ticket Type'}
]

export { fields, showFields, filterFields };
