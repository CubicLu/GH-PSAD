import React from 'react';
import { FieldType } from 'components/helpers/form_fields'

const fields = (managers = [], admins = []) => (
  [
    { name: 'image', label: 'Image', type: FieldType.FILE_FIELD},
    { name: 'name' },
    {
      name: 'disputes_count',
      type: FieldType.TEXT_LINK_FIELD,
      props: { to: '/disputes', value: 'Show list' },
      style: { maxWidth: 'inherit', display: 'inline' },
      label: 'Disputes received'
    },
    { name: 'phone', label: 'Contact' },
    { name: 'email' },
    {
      name: 'violations_count',
      type: FieldType.TEXT_LINK_FIELD,
      props: { to: '/violations', value: 'Show list' },
      style: { maxWidth: 'inherit', display: 'inline' },
      label: 'Violation records'
    },
    { name: 'parking_admin_id', type: 'select', options: admins.map(admin => { return {value: admin.id, label: admin.email}}) },
    { name: 'town_manager_id', type: 'select', options: managers.map(manager => { return {value: manager.id, label: manager.email}}) },
    {
      name: 'status',
      type: FieldType.TEXT_LINK_FIELD,
      props: { to: '/suspend', value: 'Suspend' },
      style: { maxWidth: 'inherit', display: 'inline' },
      label: 'Current status'
    }
  ]
);

// TODO: move to separate helper
const location = [
  { name: 'location.city' },
  { name: 'location.street' },
  { name: 'location.country' },
  { name: 'location.building' }
];

const filterFields = () => [
  { name: 'parking_lots.id', label: 'ID' },
  { name: 'parking_lots.name', label: 'Name' },
  { name: 'location.full_address', label: 'Location' },
  { name: 'parking_lots.email', label: 'Email' },
  { name: 'parking_lots.phone', label: 'Phone' },
  { name: 'parking_lots.status', label: 'Status' }
]

export { fields, filterFields };
