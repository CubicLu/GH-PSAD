import React from 'react';

const fields = (roles) => [
  { name: 'email', label: 'Email *' },
  { name: 'username', label: 'Username *' },
  { name: 'phone', label: 'Phone *' },
  {
    name: 'status',
    label: 'Status *',
    type: 'select',
    options: [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]
  },
  {
    name: 'role_id', label: 'Role *', type: 'select', options: roles.map(role => {
      return { value: role.id, label: role.name };
    })
  },
  { name: 'name', label: 'Name' },
];

export { fields };
