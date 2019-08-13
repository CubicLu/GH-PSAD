const fields = (managers = [], admins = []) => (
  [
    { name: 'name' },
    {
      name: 'disputes_count',
      type: 'textlink',
      props: { to: '/disputes', value: 'Show list' },
      style: { maxWidth: 'inherit', display: 'inline' },
      label: 'Disputes received'
    },
    { name: 'phone', label: 'Contact' },
    { name: 'email' },
    {
      name: 'violations_count',
      type: 'textlink',
      props: { to: '/violations', value: 'Show list' },
      style: { maxWidth: 'inherit', display: 'inline' },
      label: 'Violation records'
    },
    { name: 'parking_admin_id', type: 'select', options: admins.map(admin => { return {value: admin.id, label: admin.email}}) },
    { name: 'town_manager_id', type: 'select', options: managers.map(manager => { return {value: manager.id, label: manager.email}}) },
    {
      name: 'status',
      type: 'textlink',
      props: { to: '/suspend', value: 'Suspend' },
      style: { maxWidth: 'inherit', display: 'inline' },
      label: 'Current status'
    },
    { name: 'location.city' },
    { name: 'location.street' },
    { name: 'location.country' },
    { name: 'location.building' }
  ]
);

export { fields };
