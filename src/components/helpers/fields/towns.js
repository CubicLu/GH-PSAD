import faker from 'faker'
import { FieldType } from 'components/helpers/form_fields'
import {
  NAME,
  PHONE,
  EMAIL,
  TOWN_MANAGER_ID,
  STATUS,
} from "config/permissions/forms_fields/towns/fields"

const fieldsNew = (managers = [], permissions = []) => (
  [
    { name: 'name', label: 'Name', mandatory: true, autoFocus: true, disabled: !permissions.includes(NAME) },
    { name: 'contact_number', label: 'Contact', mandatory: true, disabled: !permissions.includes(PHONE) },
    { name: 'contact_email', label: 'Email', mandatory: true, disabled: !permissions.includes(EMAIL) },
    { name: 'town_manager_id', label: 'Town Manager', mandatory: true, type: FieldType.SELECT_FIELD, disabled: !permissions.includes(TOWN_MANAGER_ID), options: managers.map(manager => { return { value: manager.value, label: manager.label } }) },
    { name: 'status', label: 'Status', mandatory: true, type: FieldType.SELECT_FIELD, disabled: !permissions.includes(STATUS), options: [{ value: 'open', label: 'Open' }, { value: 'suspended', label: 'Suspended' }], defaultValue: 'open' },
  ]
);

const fieldsShow = (managers = [], permissions = []) => [
  ...fieldsNew(managers, permissions)
]

const exampleData = () => process.env.NODE_ENV !== 'production' ? {
  name: 'Towns test',
  contact_number: '+13583767678',
  contact_email: faker.internet.email(),
  status: 'open'
} : {
    status: 'open'
  } // These are defaults values for each field

export { fieldsNew, fieldsShow, exampleData };
