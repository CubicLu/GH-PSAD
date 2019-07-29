import React from 'react';
import TextWithLink from 'components/base/text_with_link';

const fields = [
  { name: 'name' },
  {
    name: 'disputes',
    render: (field, ...rest) => (<TextWithLink field={field} link={{ to: '/disputes', value: 'Show list' }}/>),
    label: 'Disputes received'
  },
  { name: 'contact' },
  { name: 'email' },
  {
    name: 'violations',
    render: (field, ...rest) => (<TextWithLink field={field} link={{ to: '/violations', value: 'Show list' }}/>),
    label: 'Violation records'
  },
  { name: 'parking_admin' },
  { name: 'town_manager' },
  {
    name: 'status',
    render: (field, ...rest) => (<TextWithLink field={field} link={{ to: '/suspend', value: 'Suspend' }}/>),
    label: 'Current status'
  },
  {
    name: 'location', fields: [
      { name: 'city' },
      { name: 'street' },
      { name: 'country' },
      { name: 'building' }
    ]
  }
];

export { fields };
