import { FieldType } from 'components/helpers/form_fields'

const fields = [
  {
    name: 'rate',
    label: 'Hourly Rate $',
    type: FieldType.INCREASER_FIELD,
    step: 1,
    min: 1,
    renderValue: value => `$${value}`
  },
  { name: 'period',
    label: 'Minimum Chargeable Time in minutes',
    type: FieldType.INCREASER_FIELD,
    step: 60,
    max: 6000,
    min: 60,
    renderValue: value => (value / 60)
  },
  { name: 'parked',
    label: 'Minutes before car is considered as parked',
    type: FieldType.INCREASER_FIELD,
    step: 60,
    max: 6000,
    min: 60,
    renderValue: value => (value / 60)
  },
  { name: 'overtime',
    label: 'Minutes of Overtime Allowed',
    type: FieldType.INCREASER_FIELD,
    step: 60,
    max: 6000,
    min: 60,
    renderValue: value => (value / 60)
  }
];

export { fields };
