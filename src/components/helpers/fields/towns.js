import faker from 'faker';
import { FieldType } from 'components/helpers/form_fields';
import {
  NAME,
  PHONE,
  EMAIL,
  TOWN_MANAGER_ID,
  STATUS,
} from 'config/permissions/forms_fields/towns/fields';

const fieldsNew = (statuses = [], managers = [], permissions = []) => [
  {
    name: 'name',
    label: 'Name',
    mandatory: true,
    autoFocus: true,
    disabled: !permissions.includes(NAME),
  },
  {
    name: 'contact_number',
    label: 'Contact',
    mandatory: true,
    disabled: !permissions.includes(PHONE),
  },
  {
    name: 'contact_email',
    label: 'Email',
    mandatory: true,
    disabled: !permissions.includes(EMAIL),
  },
  {
    name: 'town_manager_id',
    label: 'Town Manager',
    mandatory: true,
    type: FieldType.SELECT_FIELD,
    disabled: !permissions.includes(TOWN_MANAGER_ID),
    options: managers.map((manager) => {
      return { value: manager.value, label: manager.label };
    }),
  },
  {
    name: 'status',
    label: 'Status',
    mandatory: true,
    type: FieldType.SELECT_FIELD,
    disabled: !permissions.includes(STATUS),
    options: statuses.map((status) => {
      return { value: status.value, label: status.label };
    })
  },
];

const fieldsShow = (statuses = [], managers = [], permissions = []) => [
  ...fieldsNew(statuses, managers, permissions),
];

const fields = (managers = [], permissions = []) => (
  [
    { name: 'name', label: 'Name', mandatory: true, autoFocus: true, disabled: !permissions.includes(NAME) },
    { name: 'contact_number', label: 'Contact', mandatory: true, disabled: !permissions.includes(PHONE) },
    { name: 'contact_email', label: 'Email', mandatory: true, disabled: !permissions.includes(EMAIL) },
    { name: 'town_manager_id', label: 'Town Manager', mandatory: true, type: FieldType.SELECT_FIELD, disabled: !permissions.includes(TOWN_MANAGER_ID), options: managers.map(manager => { return { value: manager.value, label: manager.label } }) },
    { name: 'status', label: 'Status', mandatory: true, type: FieldType.SELECT_FIELD, disabled: !permissions.includes(STATUS), options: [{ value: 'opened', label: 'Opened' }, { value: 'suspended', label: 'Suspended' }], defaultValue: 'active' },
  ]
);

const exampleData = () =>
  process.env.NODE_ENV !== 'production'
    ? {
        name: 'Towns test',
        contact_number: '+13583767678',
        contact_email: faker.internet.email(),
        status: 'opened',
      }
    : {
        status: 'opened',
      }; // These are defaults values for each field

export { fieldsNew, fieldsShow, exampleData, fields };
