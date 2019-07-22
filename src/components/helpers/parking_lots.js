import React from 'react';
import TextWithLink from 'components/base/text_with_link';

const fields = [
  {
    name: 'disputes',
    render: field => (<TextWithLink field={field} link={{ to: '/disputes', value: 'Show list' }}/>),
    label: 'Disputes received'
  },
  { name: 'location' },
  { name: 'contact' },
  { name: 'email' },
  {
    name: 'violations',
    render: field => (<TextWithLink field={field} link={{ to: '/violations', value: 'Show list' }}/>),
    label: 'Violation records'
  },
  { name: 'parking_admin' },
  { name: 'town_manager' },
  {
    name: 'status',
    render: field => (<TextWithLink field={field} link={{ to: '/suspend', value: 'Suspend' }}/>),
    label: 'Current status'
  }
];

export { fields };
