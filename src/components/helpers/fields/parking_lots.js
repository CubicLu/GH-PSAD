import faker from 'faker'
import { FieldType } from 'components/helpers/form_fields'
import {
  // DISPUTE_ACCOUNT,
  // VIOLATION_COUNT,
  LOCATION,
  NAME,
  PHONE,
  EMAIL,
  PARKING_ADMIN_ID,
  TOWN_MANAGER_ID,
  STATUS
} from "config/permissions/forms_fields/parking_lots/fields"

const fieldsNew = (managers = [], admins = [], renderLocationModal, permissions = []) => (
  [
    { name: 'name', label: 'Name', mandatory: true, autoFocus:'true', disabled: !permissions.includes(NAME) },
    { name: 'parking_admin_id', label: 'Parking Admin', type: FieldType.SELECT_FIELD, disabled: !permissions.includes(PARKING_ADMIN_ID), options: admins.map(admin => { return { value: admin.value, label: admin.label } }) },
    {
      name: 'location',
      label: 'Location',
      mandatory: true,
      render: renderLocationModal,
      disabled: !permissions.includes(LOCATION)
    },
    { name: 'town_manager_id', label: 'Town Manager', mandatory: true, type: FieldType.SELECT_FIELD, disabled: !permissions.includes(TOWN_MANAGER_ID), options: managers.map(manager => { return { value: manager.value, label: manager.label } }) },
    { name: 'phone', label: 'Contact', disabled: !permissions.includes(PHONE) },
    { name: 'status', label: 'Status', mandatory: true, type: FieldType.SELECT_FIELD, disabled: !permissions.includes(STATUS), options: [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }], defaultValue: 'active' },
    { name: 'email', label: 'Email', disabled: !permissions.includes(EMAIL) }
  ]
);

const fieldsShow = (managers = [], admins = [], renderLocationModal, permissions = []) => [
  // TODO: It hasn't been discussed yet
  //  {
  //   name: 'disputes_count',
  //   type: FieldType.TEXT_LINK_FIELD,
  //   props: { to: '/disputes', value: 'Show list' },
  //   style: { maxWidth: 'inherit', display: 'inline' },
  //   label: 'Disputes received',
  //   disabled: !permissions.includes(DISPUTE_ACCOUNT)
  // },
  // {
  //   name: 'violations_count',
  //   type: FieldType.TEXT_LINK_FIELD,
  //   props: { to: '/violations', value: 'Show list' },
  //   style: { maxWidth: 'inherit', display: 'inline' },
  //   label: 'Violation records',
  //   disabled: !permissions.includes(VIOLATION_COUNT)
  // },
  ...fieldsNew(managers, admins, renderLocationModal, permissions)
]

const liveFootageFilterFields = () => [
  { name: 'name', label: 'Parking Lot Name' },
  { name: 'id', label: 'Parking Lot ID' },
  { name: 'full_address', label: 'Location' },
  { name: 'available_cameras', label: 'Available Cameras' },
]

const filterFields = (parkingAdmins, townManagers) => [
  { name: 'id', label: 'Parking Lot ID' },
  { name: 'name', label: 'Parking Lot Name' },
  { name: 'full_address', label: 'Location' },
  { name: 'phone', label: 'Contact Number ' },
  { name: 'email', label: 'Email Address' },
  {
    name: 'parking_admins',
    label: 'Parking Admin',
    type: FieldType.SELECT_FIELD,
    options: parkingAdmins.map(({ value, label }) => {
      return { value, label };
    })
  },
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

const exampleData = (roles) => process.env.NODE_ENV !== 'production' ? {
  name: 'Parking Lot test',
  phone: '+13583767678',
  email: faker.internet.email(),
  status: 'active'
} : {
    status: 'active'
  } // These are defaults values for each field

export { fieldsNew, fieldsShow, filterFields, exampleData, liveFootageFilterFields };
