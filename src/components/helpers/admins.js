import React from 'react';

const fields = (roles) => [
  { name: 'email' },
  { name: 'username' },
  { name: 'phone'},
  {
    name: 'status',
    type: 'select',
    options: [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]
  },
  {
    name: 'role_id', type: 'select', options: roles.map(role => {
      return { value: role.id, label: role.name };
    })
  },
  { name: 'name' },
];

export { fields };
