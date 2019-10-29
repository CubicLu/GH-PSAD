const fields = [
  {
    name: 'rate',
    label: 'Hourly Rate $',
    type: 'increaser',
    step: 1,
    min: 1,
    renderValue: value => `$${value}`
  },
  { name: 'period',
    label: 'Minimum Chargeable Time in minutes',
    type: 'increaser',
    step: 60,
    max: 6000,
    min: 60,
    renderValue: value => (value / 60)
  },
  { name: 'parked',
    label: 'Minutes before car is considered as parked',
    type: 'increaser',
    step: 60,
    max: 6000,
    min: 60,
    renderValue: value => (value / 60)
  },
  { name: 'overtime',
    label: 'Minutes of Overtime Allowed',
    type: 'increaser',
    step: 60,
    max: 6000,
    min: 60,
    renderValue: value => (value / 60)
  }
];

export { fields };
