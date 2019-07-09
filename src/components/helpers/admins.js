import React from 'react';
import humanizeString from 'humanize-string';

const fields = (roles) => [
  { name: 'user[email]', label: 'Email *' },
  { name: 'user[username]', label: 'Username *' },
  { name: 'user[phone]', label: 'Phone *' },
  { name: 'user[status]', label: 'Status *', type: 'select', options: [{value: 'active', label: 'Active'}, { value: 'suspended', label: 'Suspended'}]  },
  { name: 'user[role_id]', label: 'Role *', type: 'select', options: roles.map(role => { return {value: role.id, label: humanizeString(role.name)}}) },
  { name: 'user[name]', label: 'Name' },
];

export { fields };
